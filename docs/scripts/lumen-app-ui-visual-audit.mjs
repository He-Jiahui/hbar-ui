import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourcePath = path.resolve(root, 'packages/lumen-app-ui/src/source-catalog.json');
const defaultOutput = path.resolve(root, 'tmp/lumen-app-ui-visual-audit');
const recordFile = path.resolve(
  root,
  process.env.LUMEN_AUDIT_RECORD ?? 'docs/src/modules/lumen-gallery/lumen-visual-audit-record.json',
);
const baseUrl = process.env.LUMEN_PREVIEW_URL ?? 'http://127.0.0.1:3020/experiments/lumen-app-ui/';
const outputDir = path.resolve(
  root,
  process.env.LUMEN_VISUAL_AUDIT_DIR ?? path.relative(root, defaultOutput),
);
const workerCount = Math.max(1, Number.parseInt(process.env.LUMEN_AUDIT_WORKERS ?? '4', 10) || 4);
const limit = Number.parseInt(process.env.LUMEN_AUDIT_LIMIT ?? '', 10) || Number.POSITIVE_INFINITY;
const selectedIds = new Set(
  (process.env.LUMEN_AUDIT_VARIANTS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'narrow', width: 390, height: 844 },
];
const modes = ['dark', 'light'];

const sourceVariants = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const variants = sourceVariants
  .filter((variant) => selectedIds.size === 0 || selectedIds.has(variant.id))
  .slice(0, limit);
if (variants.length === 0) {
  throw new Error('No variants selected. Check LUMEN_AUDIT_VARIANTS or LUMEN_AUDIT_LIMIT.');
}

const tasks = variants.flatMap((variant) =>
  modes.flatMap((mode) =>
    viewports.map((viewport) => ({
      variant,
      mode,
      viewport,
      screenshot: path.join(
        outputDir,
        variant.category,
        `${variant.id}__${mode}__${viewport.name}.png`,
      ),
    })),
  ),
);

await fs.mkdir(outputDir, { recursive: true });
const startedAt = new Date().toISOString();
let cursor = 0;
let completed = 0;
let aborted = false;
const results = [];

process.on('SIGINT', () => {
  aborted = true;
  console.warn('\nAbort requested; active workers will finish their current page.');
});

function previewUrl(id, mode) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}id=${encodeURIComponent(id)}&locale=en&mode=${mode}`;
}

async function auditTask(page, task) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  };
  const onPageError = (error) => pageErrors.push(String(error));
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  const result = {
    id: task.variant.id,
    category: task.variant.category,
    mode: task.mode,
    viewport: task.viewport.name,
    screenshot: path.relative(root, task.screenshot).replaceAll('\\', '/'),
    componentCount: 0,
    bodyTextLength: 0,
    horizontalOverflow: false,
    consoleErrors,
    pageErrors,
    error: null,
  };

  try {
    await page.setViewportSize({ width: task.viewport.width, height: task.viewport.height });
    await page.goto(previewUrl(task.variant.id, task.mode), {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    const marker = page.locator(
      `[data-hbar-app-ui-component="${task.variant.id.replaceAll('"', '\\"')}"]`,
    );
    await marker.first().waitFor({ state: 'attached', timeout: 15_000 });
    await page.waitForTimeout(80);
    const metrics = await page.evaluate(() => ({
      bodyTextLength: document.body?.innerText.trim().length ?? 0,
      componentCount: document.querySelectorAll('[data-hbar-app-ui-component]').length,
      horizontalOverflow:
        Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0) >
        document.documentElement.clientWidth + 1,
    }));
    result.bodyTextLength = metrics.bodyTextLength;
    result.componentCount = metrics.componentCount;
    result.horizontalOverflow = metrics.horizontalOverflow;
    if (result.bodyTextLength === 0) {
      throw new Error('Rendered body is empty');
    }
    if (result.componentCount !== 1) {
      throw new Error(`Expected one component marker, received ${result.componentCount}`);
    }
    await fs.mkdir(path.dirname(task.screenshot), { recursive: true });
    await page.screenshot({ path: task.screenshot, fullPage: true, animations: 'disabled' });
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
  return result;
}

async function worker(browser, workerId) {
  const context = await browser.newContext({
    viewport: { width: viewports[0].width, height: viewports[0].height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    while (!aborted) {
      const taskIndex = cursor;
      cursor += 1;
      if (taskIndex >= tasks.length) {
        return;
      }
      const result = await auditTask(page, tasks[taskIndex]);
      results[taskIndex] = result;
      completed += 1;
      if (
        completed % 25 === 0 ||
        result.error ||
        result.consoleErrors.length > 0 ||
        result.pageErrors.length > 0
      ) {
        const status =
          result.error || result.consoleErrors.length > 0 || result.pageErrors.length > 0
            ? 'FAIL'
            : 'ok';
        console.info(
          `[${completed}/${tasks.length}] ${status} ${result.id} ${result.mode}/${result.viewport}`,
        );
      }
    }
  } finally {
    await context.close();
    console.info(`worker-${workerId} stopped`);
  }
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.LUMEN_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.LUMEN_CHROMIUM_EXECUTABLE }
    : {}),
});
try {
  await Promise.all(
    Array.from({ length: Math.min(workerCount, tasks.length) }, (_, index) =>
      worker(browser, index + 1),
    ),
  );
} finally {
  await browser.close();
}

const finishedAt = new Date().toISOString();
const completedResults = results.filter(Boolean);
const failed = completedResults.filter(
  (result) => result.error || result.consoleErrors.length > 0 || result.pageErrors.length > 0,
);
const overflow = completedResults.filter((result) => result.horizontalOverflow);
const missing = tasks.filter((_, index) => !results[index]);
const manifest = {
  baseUrl,
  startedAt,
  finishedAt,
  requestedVariants: variants.length,
  requestedScreenshots: tasks.length,
  completedScreenshots: completedResults.length,
  failedScreenshots: failed.length,
  overflowScreenshots: overflow.length,
  missingScreenshots: missing.length,
  workerCount,
  viewports,
  modes,
  variants: variants.map((variant) => ({
    id: variant.id,
    category: variant.category,
    variant: variant.variant,
  })),
  results: completedResults,
};
await fs.writeFile(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

if (
  selectedIds.size === 0 &&
  variants.length === sourceVariants.length &&
  completedResults.length === tasks.length
) {
  const byVariant = new Map();
  for (const result of completedResults) {
    const entry = byVariant.get(result.id) ?? {
      id: result.id,
      category: result.category,
      variant: variants.find((item) => item.id === result.id)?.variant,
      combinations: {},
      issues: [],
    };
    const key = `${result.mode}/${result.viewport}`;
    const failedCombination =
      Boolean(result.error) ||
      result.consoleErrors.length > 0 ||
      result.pageErrors.length > 0 ||
      result.horizontalOverflow;
    entry.combinations[key] = failedCombination ? 'failed' : 'passed';
    if (failedCombination) {
      entry.issues.push({
        combination: key,
        error: result.error,
        consoleErrors: result.consoleErrors.length,
        pageErrors: result.pageErrors.length,
        horizontalOverflow: result.horizontalOverflow,
      });
    }
    byVariant.set(result.id, entry);
  }
  const record = {
    schemaVersion: 1,
    generatedAt: finishedAt,
    baseUrl,
    viewports,
    modes,
    summary: {
      variants: variants.length,
      combinations: tasks.length,
      passed: completedResults.filter(
        (result) =>
          !result.error &&
          result.consoleErrors.length === 0 &&
          result.pageErrors.length === 0 &&
          !result.horizontalOverflow,
      ).length,
      failed: completedResults.filter(
        (result) =>
          result.error ||
          result.consoleErrors.length > 0 ||
          result.pageErrors.length > 0 ||
          result.horizontalOverflow,
      ).length,
    },
    variants: [...byVariant.values()],
  };
  await fs.writeFile(recordFile, `${JSON.stringify(record, null, 2)}\n`);
  console.info(`Committed visual audit record: ${recordFile}`);
}

console.info(`Visual audit manifest: ${path.join(outputDir, 'manifest.json')}`);
console.info(
  `Completed ${completedResults.length}/${tasks.length}; failures=${failed.length}; overflow=${overflow.length}; missing=${missing.length}`,
);
if (aborted || failed.length > 0 || missing.length > 0) {
  process.exitCode = 1;
}

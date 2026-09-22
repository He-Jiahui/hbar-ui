import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const violations = [];

for (const name of fs.readdirSync(root)) {
  if (!/\.(ts|tsx)$/.test(name) || name.endsWith('.test.tsx')) {
    continue;
  }
  const source = fs.readFileSync(path.join(root, name), 'utf8');
  if (/@mui\//.test(source)) {
    violations.push(name);
  }
}

if (violations.length) {
  console.error('Lumen preview boundary guard failed:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log('Lumen preview boundary guard passed.');
}

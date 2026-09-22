export interface LumenPreviewRouteOptions {
  readonly embedded?: boolean | undefined;
  readonly locale?: 'zh' | 'en' | undefined;
  readonly mode?: 'dark' | 'light' | undefined;
}

export function createLumenPreviewHref(
  id: string,
  { embedded = false, locale, mode }: LumenPreviewRouteOptions = {},
) {
  const search = new URLSearchParams({ id });
  if (embedded) {
    search.set('embed', '1');
  }
  if (mode) {
    search.set('mode', mode);
  }
  if (locale) {
    search.set('locale', locale);
  }
  return `/experiments/lumen-app-ui/?${search.toString()}`;
}

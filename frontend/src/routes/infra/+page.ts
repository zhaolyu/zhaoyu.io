// Prerendered shell: the <head> (title, description, noindex) and the page
// skeleton ship as static HTML; PGlite is imported on demand inside
// costDB.start() from onMount, so nothing browser-only runs at build time.
export const prerender = true;

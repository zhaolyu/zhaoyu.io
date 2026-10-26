// Prerendered shell: the <head>, the headline, the method section and the
// sample record ship as static HTML. The live record is fetched on mount, so
// nothing network-bound runs at build time and the page is never blank.
export const prerender = true;

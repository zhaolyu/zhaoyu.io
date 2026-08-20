import { error } from '@sveltejs/kit';
import { CASE_STUDIES, caseStudy } from '$lib/constants/case-studies';
import { visibleItems } from '$lib/utils/feature-flags';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

// Flag-gated studies are excluded here, from the sitemap, from OG generation,
// and from llms.txt — the same visibility rule on every surface.
export const entries: EntryGenerator = () =>
  visibleItems(CASE_STUDIES).map((cs) => ({ slug: cs.slug }));

export const load: PageLoad = ({ params }) => {
  const study = caseStudy(params.slug);
  const visible = study && visibleItems([study]).length > 0;
  if (!study || !visible) error(404, 'No case study at this address');

  return { study };
};

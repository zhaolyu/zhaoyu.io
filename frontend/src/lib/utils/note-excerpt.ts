import type { EngineeringNote } from '$lib/constants/content';

/**
 * Plain-text excerpt of a note's first paragraph, for meta descriptions
 * and listing previews. Strips the note's inline HTML markup.
 */
export function noteExcerpt(
  note: Pick<EngineeringNote, 'content' | 'title'>,
  maxLength = 160,
): string {
  const source = note.content[0] ?? note.title;
  return source.replace(/<[^>]+>/g, '').slice(0, maxLength);
}

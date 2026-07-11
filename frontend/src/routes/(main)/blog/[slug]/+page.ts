import { error } from '@sveltejs/kit';
import { notesData } from '$lib/constants/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => notesData.notes.map((note) => ({ slug: note.slug }));

export const load: PageLoad = ({ params }) => {
  const note = notesData.notes.find((n) => n.slug === params.slug);

  if (!note) {
    error(404, 'Note not found');
  }

  return { note };
};

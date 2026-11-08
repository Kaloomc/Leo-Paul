import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Sport = CollectionEntry<'sports'>;

/** Articles publiés (hors brouillons), du plus récent au plus ancien. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Sports triés par ordre d'affichage. */
export async function getSports(): Promise<Sport[]> {
  const sports = await getCollection('sports');
  return sports.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/** Dictionnaire id → sport, pratique pour les cartes. */
export async function getSportMap(): Promise<Map<string, Sport>> {
  return new Map((await getSports()).map((s) => [s.id, s]));
}

/** Temps de lecture estimé (230 mots / minute). */
export function readingTime(body = ''): string {
  const words = body.replace(/[#>*_`|\-[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 230))} min`;
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('fr-FR', style === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: 'short' });
}

/** « Le sport, *sans filtre.* » → HTML avec la partie entre * en contour. */
export function displayTitle(title: string): string {
  const esc = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*(.+?)\*/g, '<span class="outline">$1</span>');
}

export function plainTitle(title: string): string {
  return title.replace(/\*/g, '');
}

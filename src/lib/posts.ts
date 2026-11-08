import { getCollection } from 'astro:content';

/** Articles publiés (hors brouillons), du plus récent au plus ancien. */
export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

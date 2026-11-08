import rss from '@astrojs/rss';
import { getPublishedPosts, getSportMap } from '../lib/posts';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const posts = await getPublishedPosts();
  const sports = await getSportMap();
  return rss({
    title: `${SITE_TITLE} — Blog sport`,
    description: SITE_DESCRIPTION,
    site: context.site,
    customData: '<language>fr-fr</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [sports.get(post.data.sport)?.data.name, ...post.data.tags].filter(Boolean),
    })),
  });
}

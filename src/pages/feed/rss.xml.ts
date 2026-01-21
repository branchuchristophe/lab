import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../../lib/constants';

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  // Get all articles from content collection
  const allArticles = await getCollection('articles');

  // Filter to only published articles and sort by date (newest first)
  const publishedArticles = allArticles
    .filter((article) => article.data.status === 'published')
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  // Site configuration
  const siteUrl = SITE_URL;
  const siteTitle = 'Lab - Agent-Native Blog';
  const siteDescription = 'AI & automation content for humans and machines';

  // RSS feed items
  const rssItems = publishedArticles.map((article) => {
    const articleUrl = `${siteUrl}/articles/${article.slug}/`;

    // Build content summary for description
    const summary = article.body
      .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim()
      .substring(0, 500);

    // Build author string
    let author = article.data.author;
    if (article.data.coauthored && article.data.aiContributors) {
      author += ` (with ${article.data.aiContributors.join(', ')})`;
    }

    return `
    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(summary)}</description>
      <pubDate>${article.data.publishedAt.toUTCString()}</pubDate>
      <author>${escapeXml(author)}</author>
      <category>${escapeXml(article.data.topic)}</category>
      ${article.data.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
  }).join('\n');

  // Build RSS XML
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(siteUrl)}/feed/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Astro</generator>${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600', // Cache for 1 hour
    },
  });
};

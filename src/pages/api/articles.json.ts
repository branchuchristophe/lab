import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Author type definition
type Author = {
  name: string;
  type: 'human' | 'ai';
};

export const GET: APIRoute = async () => {
  // Get all articles from content collection
  const allArticles = await getCollection('articles');

  // Filter to only published articles and sort by date (newest first)
  const publishedArticles = allArticles
    .filter((article) => article.data.status === 'published')
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  // Map to agent-friendly JSON structure
  const articlesData = publishedArticles.map((article) => {
    // Calculate content summary (first 200 chars of body)
    const summary = article.body
      .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim()
      .substring(0, 200)
      + '...';

    // Calculate reading time and word count
    const words = article.body.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute

    // Build article URL
    const url = `https://lab.example.com/articles/${article.slug}/`;

    // Build authors array
    const authors: Author[] = [
      {
        name: article.data.author,
        type: 'human',
      },
    ];

    // Add AI contributors if coauthored
    if (article.data.coauthored && article.data.aiContributors) {
      article.data.aiContributors.forEach((ai) => {
        authors.push({
          name: ai,
          type: 'ai',
        });
      });
    }

    // Generate default Claude URL if not provided
    const defaultClaudeUrl = `https://claude.ai/new?q=${encodeURIComponent(
      `Read and discuss this article: ${article.data.title}\n\n${url}`
    )}`;

    // Generate default ChatGPT URL if not provided
    const defaultChatGPTUrl = `https://chat.openai.com/?q=${encodeURIComponent(
      `Read and discuss this article: ${article.data.title}\n\n${url}`
    )}`;

    return {
      // Core metadata
      slug: article.slug,
      url,
      title: article.data.title,
      description: article.data.description,
      date: article.data.publishedAt.toISOString(),
      lastUpdated: article.data.lastUpdated?.toISOString(),
      version: article.data.version,

      // Taxonomy
      topic: article.data.topic,
      tags: article.data.tags,
      seriesId: article.data.seriesId,
      seriesOrder: article.data.seriesOrder,

      // Content
      summary,
      readingTime,
      wordCount: words,

      // Authors
      authors,
      coauthored: article.data.coauthored,
      coauthorNote: article.data.coauthorNote,
      validationLevel: article.data.validationLevel,

      // Agent actions
      actions: {
        claudeUrl: article.data.claudeUrl || defaultClaudeUrl,
        chatgptUrl: article.data.chatgptUrl || defaultChatGPTUrl,
        githubUrl: article.data.githubUrl,
        notebookUrl: article.data.notebookUrl,
      },

      // Machine context (for agents/scrapers)
      machineContext: {
        purpose: article.data.purpose,
        prerequisites: article.data.prerequisites,
        outputs: article.data.outputs,
        codeLanguages: article.data.codeLanguages,
      },

      // SEO
      keywords: article.data.keywords,
      canonical: article.data.canonical,
      schemaType: article.data.schemaType,
      featured: article.data.featured,
      searchable: article.data.searchable,

      // Media
      image: article.data.image,
    };
  });

  // Return JSON response
  return new Response(
    JSON.stringify(
      {
        meta: {
          total: articlesData.length,
          generated: new Date().toISOString(),
          version: '1.0',
        },
        articles: articlesData,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    }
  );
};

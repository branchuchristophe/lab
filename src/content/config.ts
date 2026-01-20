import { defineCollection, z } from 'astro:content';

// Article schema - validated at build time
const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Core metadata
    title: z.string().max(60),
    description: z.string().max(160),
    publishedAt: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    version: z.number().default(1),
    author: z.string().default('Christophe'),

    // Taxonomy
    topic: z.enum(['ai', 'automation', 'experiments', 'engineering', 'personal']),
    tags: z.array(z.string()).default([]),
    seriesId: z.string().optional(),
    seriesOrder: z.number().optional(),

    // Co-authorship (AI transparency)
    coauthored: z.boolean().default(false),
    aiContributors: z.array(z.string()).optional(), // ['Claude', 'GPT-4']
    coauthorNote: z.string().optional(),
    validationLevel: z.enum(['experimental', 'tested', 'production']).default('tested'),

    // SEO
    canonical: z.string().url().optional(),
    keywords: z.array(z.string()).default([]),
    schemaType: z.enum(['Article', 'HowTo', 'FAQPage', 'BlogPosting']).default('Article'),
    noindex: z.boolean().default(false),

    // Media
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),

    // Agent actions
    claudeUrl: z.string().optional(),
    chatgptUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    notebookUrl: z.string().optional(),

    // Machine context (for scrapers/agents)
    purpose: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    outputs: z.array(z.string()).optional(),
    codeLanguages: z.array(z.string()).optional(),

    // Status & indexing
    status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
    featured: z.boolean().default(false),
    searchable: z.boolean().default(true),

    // Computed at build time
    readingTime: z.number().optional(),
    wordCount: z.number().optional(),
  }),
});

// Topics collection for hub pages
const topicsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
});

// Series for multi-part content
const seriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    articleSlugs: z.array(z.string()),
    status: z.enum(['in-progress', 'complete']).default('in-progress'),
  }),
});

// Authors including AI co-authors
const authorsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['human', 'ai']),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    links: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  articles: articlesCollection,
  topics: topicsCollection,
  series: seriesCollection,
  authors: authorsCollection,
};

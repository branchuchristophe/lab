import { WORDS_PER_MINUTE, SITE_URL } from './constants';

/**
 * Format a date for display
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date with long month format
 */
export function formatDateLong(date: Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time from text content
 */
export function calculateReadingTime(content: string): number {
  const wordCount = countWords(content);
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

/**
 * Count words in text content
 */
export function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

/**
 * Generate article URL from slug
 */
export function getArticleUrl(slug: string): string {
  return `${SITE_URL}/articles/${slug}`;
}

/**
 * Generate default Claude conversation URL for an article
 */
export function generateClaudeUrl(
  title: string,
  articleUrl: string,
  description: string
): string {
  const prompt = `Read this article and help me understand it: ${title}\n\nArticle: ${articleUrl}\n\nDescription: ${description}`;
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

/**
 * Generate default ChatGPT conversation URL for an article
 */
export function generateChatGPTUrl(
  title: string,
  articleUrl: string,
  description: string
): string {
  const prompt = `Read this article and help me understand it: ${title}\n\nArticle: ${articleUrl}\n\nDescription: ${description}`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

/**
 * Generate X (Twitter) share URL
 */
export function generateXShareUrl(title: string, description: string, articleUrl: string): string {
  const text = encodeURIComponent(`${title} - ${description}`);
  const url = encodeURIComponent(articleUrl);
  return `https://x.com/intent/tweet?text=${text}&url=${url}`;
}

/**
 * Generate LinkedIn share URL
 */
export function generateLinkedInShareUrl(articleUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
}

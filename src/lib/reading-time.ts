import { Article } from '../types/article';

const WORDS_PER_MINUTE = 215;

export function countArticleWords(article: Article): number {
  const parts: string[] = [
    article.headline,
    article.introduction,
    article.closingNote,
  ];

  for (const section of article.sections) {
    if (section.subheading) {
      parts.push(section.subheading);
    }
    if (section.pullQuote) {
      parts.push(section.pullQuote);
    }
    for (const paragraph of section.paragraphs) {
      parts.push(paragraph);
    }
  }

  const text = parts.join(' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

export function calculateReadingTimeMinutes(article: Article): number {
  const words = countArticleWords(article);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

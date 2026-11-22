import { ARTICLES } from '../data/articles';
import { Article } from '../types/article';

const SESSION_STORAGE_KEY = 'artenos_current_article_id';

export function getInitialArticle(): Article {
  if (typeof window !== 'undefined') {
    try {
      const savedId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedId) {
        const found = ARTICLES.find((a) => a.id === savedId);
        if (found) return found;
      }
    } catch {
      // Ignore sessionStorage access errors in restricted environments
    }
  }

  const randomIndex = Math.floor(Math.random() * ARTICLES.length);
  const selected = ARTICLES[randomIndex];

  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, selected.id);
    } catch {
      // Ignore
    }
  }

  return selected;
}

export function selectNextArticle(currentId: string): Article {
  const alternatives = ARTICLES.filter((a) => a.id !== currentId);
  if (alternatives.length === 0) {
    return ARTICLES[0];
  }
  const randomIndex = Math.floor(Math.random() * alternatives.length);
  const next = alternatives[randomIndex];

  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, next.id);
    } catch {
      // Ignore
    }
  }

  return next;
}

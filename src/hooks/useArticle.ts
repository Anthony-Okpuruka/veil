import { useCallback, useMemo, useState } from 'react';
import { getInitialArticle, selectNextArticle } from '../lib/article-selector';
import { calculateReadingTimeMinutes } from '../lib/reading-time';
import { Article } from '../types/article';

export function useArticle(onBeforeChange?: () => void) {
  const [article, setArticle] = useState<Article>(() => getInitialArticle());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const readingTimeMinutes = useMemo(
    () => calculateReadingTimeMinutes(article),
    [article]
  );

  const discoverAnother = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    onBeforeChange?.();

    window.setTimeout(() => {
      setArticle((prev) => selectNextArticle(prev.id));
      window.setTimeout(() => {
        setIsTransitioning(false);
      }, 120);
    }, 240);
  }, [isTransitioning, onBeforeChange]);

  return {
    article,
    readingTimeMinutes,
    isTransitioning,
    discoverAnother,
  };
}

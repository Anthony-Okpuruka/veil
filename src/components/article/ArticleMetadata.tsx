import React from 'react';
import { ArticleCategory } from '../../types/article';

interface ArticleMetadataProps {
  issueNumber: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({
  issueNumber,
  category,
  readingTimeMinutes,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-[#A59BAA] tabular-nums">
      <span className="text-[#C5A46D]">{issueNumber}</span>
      <span aria-hidden="true" className="text-[#302A34]">
        ·
      </span>
      <span>{category}</span>
      <span aria-hidden="true" className="text-[#302A34]">
        ·
      </span>
      <span>{readingTimeMinutes} min read</span>
    </div>
  );
};

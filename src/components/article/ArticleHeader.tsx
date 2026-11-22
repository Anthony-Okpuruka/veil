import React from 'react';
import { ArticleCategory } from '../../types/article';
import { ArticleMetadata } from './ArticleMetadata';

interface ArticleHeaderProps {
  issueNumber: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  headline: string;
  introduction: string;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  issueNumber,
  category,
  readingTimeMinutes,
  headline,
  introduction,
}) => {
  return (
    <header className="mb-10 border-b border-[#302A34]/80 pb-8 sm:mb-12 sm:pb-10">
      <ArticleMetadata
        issueNumber={issueNumber}
        category={category}
        readingTimeMinutes={readingTimeMinutes}
      />

      <h1 className="mt-5 font-display text-4xl leading-[1.03] tracking-[0.025em] text-[#F3EFE8] sm:text-5xl lg:text-[3.5rem] [text-wrap:balance]">
        {headline}
      </h1>

      <p className="mt-5 text-base font-light leading-[1.7] text-[#D8BD83]/90 sm:text-lg">
        {introduction}
      </p>
    </header>
  );
};

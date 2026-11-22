import React from 'react';
import { Article } from '../../types/article';
import { ArticleHeader } from './ArticleHeader';

interface ArticleBodyProps {
  article: Article;
  readingTimeMinutes: number;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({
  article,
  readingTimeMinutes,
}) => {
  return (
    <article
      aria-label={article.headline}
      className="mx-auto max-w-2xl text-[#F3EFE8]"
    >
      <ArticleHeader
        issueNumber={article.issueNumber}
        category={article.category}
        readingTimeMinutes={readingTimeMinutes}
        headline={article.headline}
        introduction={article.introduction}
      />

      <div className="space-y-8">
        {article.sections.map((section, sIdx) => (
          <section key={sIdx} className="space-y-5">
            {section.subheading && (
              <h2 className="pt-3 font-display text-2xl tracking-[0.035em] text-[#D8BD83] sm:text-[1.75rem]">
                {section.subheading}
              </h2>
            )}

            {section.paragraphs.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className="text-[16px] font-normal leading-[1.82] tracking-[0.008em] text-[#F3EFE8]/90 sm:text-[17px]"
              >
                {paragraph}
              </p>
            ))}

            {section.pullQuote && (
              <blockquote className="my-8 border-y border-[#302A34] py-6 text-center">
                <p className="mx-auto max-w-xl text-base font-light italic leading-[1.7] text-[#D8BD83] sm:text-lg">
                  “{section.pullQuote}”
                </p>
              </blockquote>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-10 border-t border-[#302A34]/80 pt-7">
        <p className="text-[15.5px] font-normal leading-[1.8] text-[#A59BAA]">
          {article.closingNote}
        </p>

        {article.sources.length > 0 && (
          <div className="mt-6 pt-5 border-t border-[#302A34]/40">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#76618F]">
              Sources &amp; Further Reading
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-[#A59BAA]/80">
              {article.sources.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </article>
  );
};

export type ArticleCategory =
  | 'Oceanography'
  | 'Astronomy'
  | 'Forgotten History'
  | 'Psychology'
  | 'Natural History'
  | 'Ancient Civilisations'
  | 'Mathematics'
  | 'Material Culture'
  | 'Scientific Discovery'
  | 'Philosophy';

export interface ArticleSection {
  subheading?: string;
  paragraphs: string[];
  pullQuote?: string;
}

export interface Article {
  id: string;
  issueNumber: string;
  category: ArticleCategory;
  headline: string;
  introduction: string;
  sections: ArticleSection[];
  closingNote: string;
  sources: string[];
}

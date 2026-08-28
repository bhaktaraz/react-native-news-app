export interface Author {
  id: number;
  name: string;
  image?: string;
  website?: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  /** null for the default (Nepali) edition. */
  edition?: number | null;
}

export interface Edition {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  tag_id: number;
  name: string;
  slug: string;
  total_count?: number;
}

export interface Article {
  id: number;
  title: string;
  intro: string;
  highlight?: string | null;
  content?: string;
  image: string;
  image_caption?: string;
  url: string;
  author?: Author | string;
  categories?: Category[];
  tags?: Tag[];
  breaking?: boolean;
  featured?: boolean;
  created_on: string;
  updated_on?: string;
  date_en?: string;
  date_np?: string;
  view_count?: number;
  youtube_video_id?: string;
  related_news?: Article[];
}

export interface Page<T> {
  items: T[];
  page: number;
  hasMore: boolean;
  totalResults: number;
}

export interface HomePayload {
  breaking: Article[];
  featured: Article[];
  latest: Article[];
  categories: Category[];
  sections: { category: Category; news: Article[] }[];
}

export interface NewsQuery {
  page?: number;
  perPage?: number;
  category?: number | string;
  tag?: number | string;
  author?: number | string;
  q?: string;
  breaking?: boolean;
  featured?: boolean;
}

/** Thrown for any failed request so screens can tell offline from server error. */
export class ApiError extends Error {
  readonly offline: boolean;
  readonly status?: number;

  constructor(message: string, offline: boolean, status?: number) {
    super(message);
    this.name = "ApiError";
    this.offline = offline;
    this.status = status;
  }
}

export const authorName = (author?: Author | string): string => {
  if (!author) {
    return "धनगढी खबर";
  }
  return typeof author === "string" ? author : author.name;
};

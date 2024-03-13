export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  status: "draft" | "published"; // status can only be 'draft' or 'published'
}

export interface PostWithPagination {
  data: Post[] | [];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface postSearchData {
  rowsPerPage: number;
  searchName: string | null;
  searchStatus: string | null;
}

interface ImageFile {
  name: string;
  file: File;
}

export interface PostPayload {
  title: string;
  slug: string;
  content: string;
  image?: ImageFile[];
  status: "draft" | "published"; // status can only be 'draft' or 'published'
}

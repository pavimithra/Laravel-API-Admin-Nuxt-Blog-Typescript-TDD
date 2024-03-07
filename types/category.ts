export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface ImageFile {
  name: string;
  file: File;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  image?: ImageFile[];
}

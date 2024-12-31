export type CreateCategoryDTO = {
  name: string;
  description?: string;
  status?: "publish" | "unpublish";
};

export type GetCategoriesBodyDTO = {
  name?: string;
  id?: string;
  include_products?: boolean;
  status?: string;
  order?: string;
  sortBy?: string;
  created_at?: string;
  updated_at?: string;
};

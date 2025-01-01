import { ModelStatus } from "@/app/shared/models/others/status.model";

export type CreateCategoryDTO = {
  name: string;
  description?: string;
  status?: ModelStatus;
  image_id?: string;
};

export type CreateCategoryFormDTO = {
  name: string;
  description?: string;
  imageId?: string;
  status?: ModelStatus;
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

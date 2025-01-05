import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type ProductModel = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  inventory?: {
    quantity?: number;
  };
  discount?: {
    id?: string;
    name?: string;
    type?: string;
    discount_percentage?: number;
    description?: string;
    end_date?: string;
    start_date?: string;
  }[];
  category?: {
    id?: string;
    name?: string;
    image_id?: string;
    description?: string;
  }[];
  image?: {
    id?: string;
    type?: string;
    url?: string;
    cloudinary_id?: string;
  }[];
};

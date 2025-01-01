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
    quantity: number;
  };
  discount?: {
    discount_percentage: number;
  }[];
  category?: {
    name: string;
  }[];
  image?: {
    url: string;
  }[];
};

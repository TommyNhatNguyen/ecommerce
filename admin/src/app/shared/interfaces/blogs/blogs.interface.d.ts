import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface IBlogsCreate {
  title: string;
  description: string;
  short_description: string;
  thumnail_url: string;
  user_id: string;
  status: ModelStatus;
}

export interface IBlogsUpdate {
  title?: string;
  description?: string;
  short_description?: string;
  thumnail_url?: string;
  user_id?: string;
  status?: ModelStatus;
}

export interface IBlogsCondition {
  id?: string;
  title?: string;
  description?: string;
  short_description?: string;
  thumnail_url?: string;
  user_id?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  limit?: number;
  page?: number;
  order?: OrderModel;
  include_users?: boolean;
  include_all?: boolean;
}

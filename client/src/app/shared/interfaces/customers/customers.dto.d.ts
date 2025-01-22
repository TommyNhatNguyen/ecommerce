import { ModelStatus } from "../../models/others/status.model";

export interface CustomerConditionDTO {
  cart_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city_id?: string;
  status?: ModelStatus;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  page?: number;
}

import { ModelStatus } from "@/app/shared/models/others/status.model";
import { User } from "@/app/shared/models/user/user.model";

export interface IBlogs {
  id: string;
  title: string;
  description: string;
  short_description: string;
  thumnail_url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: ModelStatus;
  user: User;
}

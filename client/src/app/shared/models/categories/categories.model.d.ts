import { ImageModel } from "@/app/shared/models/images/images.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type CategoryModel = {
  id: string;
  name: string;
  description: string | null;
  image_id?: string | null;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  image?: ImageModel;
};

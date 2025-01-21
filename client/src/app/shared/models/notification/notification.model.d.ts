import { ModelStatus } from "@/app/shared/models/others/base-model";

export interface NotificationModel {
  id: string;
  entity_id: string;
  actor_id: string;
  message: string;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
  status: ModelStatus;
}

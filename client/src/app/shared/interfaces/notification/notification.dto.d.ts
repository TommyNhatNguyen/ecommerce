export interface NotificationConditionDTO  {
  id?: string;
  entity_id?: string;
  actor_id?: string;
  message?: string;
  read_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  status?: ModelStatus;
}
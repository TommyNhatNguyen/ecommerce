import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const MessageModelSchema = z.object({
  id: z.string().uuid(),
  entity_id: z.string().uuid(),
  actor_id: z.string().uuid(),
  message: z.string(),
  read_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
});

export type MessageModel = z.infer<typeof MessageModelSchema>;

import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export enum ActorType {
  CUSTOMER = 'customer',
  SYSTEM = 'system',
  ADMIN = 'admin',
}
    
export const ActorSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(ActorType),
  actor_info_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.nativeEnum(ModelStatus),
});

export type Actor = z.infer<typeof ActorSchema>;

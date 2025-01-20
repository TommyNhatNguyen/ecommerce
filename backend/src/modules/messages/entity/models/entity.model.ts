import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export enum EntityKind {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
    
export const EntitySchema = z.object({
  id: z.string().uuid(),
  kind: z.nativeEnum(EntityKind),
  type: z.string(),
  template: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.nativeEnum(ModelStatus),
});

export type Entity = z.infer<typeof EntitySchema>;

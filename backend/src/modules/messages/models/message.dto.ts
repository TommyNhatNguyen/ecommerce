import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { MessageModelSchema } from 'src/modules/messages/models/message.model';
import z from 'zod';

export const IMessageCreateDTOSchema = z.object({
  entity_id: z.string().uuid(),
  actor_id: z.string().uuid(),
  entity_info: z.object({
    kind: z.nativeEnum(EntityKind),
    type: z.string(),
  }),
  actor_info_id: z.string().uuid(),
  actor_type: z.nativeEnum(ActorType),
  message: z.string(),
  read_at: z.string().datetime().nullable().optional(),
});

export const IMessageUpdateDTOSchema = MessageModelSchema.partial().omit({
  id: true,
});
export const IMessageConditionDTOSchema = MessageModelSchema.partial();

export type IMessageCreateDTO = z.infer<typeof IMessageCreateDTOSchema>;
export type IMessageUpdateDTO = z.infer<typeof IMessageUpdateDTOSchema>;
export type IMessageConditionDTO = z.infer<typeof IMessageConditionDTOSchema>;

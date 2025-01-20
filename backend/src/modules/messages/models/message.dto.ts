import { MessageModelSchema } from 'src/modules/messages/models/message.model';
import z from 'zod';

export const IMessageCreateDTOSchema = z.object({
  entity_id: z.string().uuid(),
  actor_id: z.string().uuid(),
  message: z.string(),
});

export const IMessageUpdateDTOSchema = MessageModelSchema.partial().omit({
  id: true,
});
export const IMessageConditionDTOSchema = MessageModelSchema.partial();

export type IMessageCreateDTO = z.infer<typeof IMessageCreateDTOSchema>;
export type IMessageUpdateDTO = z.infer<typeof IMessageUpdateDTOSchema>;
export type IMessageConditionDTO = z.infer<typeof IMessageConditionDTOSchema>;

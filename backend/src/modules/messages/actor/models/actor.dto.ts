import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const IActorCreateDTOSchema = z.object({
  type: z.nativeEnum(ActorType),
  actor_id: z.string().uuid(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
});

export const IActorUpdateDTOSchema = z.object({
  type: z.nativeEnum(ActorType).optional(),
  actor_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const IActorConditionDTOSchema = z.object({
  type: z.nativeEnum(ActorType).optional(),
  actor_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type IActorCreateDTO = z.infer<typeof IActorCreateDTOSchema>;
export type IActorUpdateDTO = z.infer<typeof IActorUpdateDTOSchema>;
export type IActorConditionDTO = z.infer<typeof IActorConditionDTOSchema>;

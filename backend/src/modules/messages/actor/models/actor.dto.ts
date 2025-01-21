import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const IActorCreateDTOSchema = z.object({
  type: z.nativeEnum(ActorType),
  actor_info_id: z.string().uuid(),
});

export const IActorUpdateDTOSchema = z.object({
  type: z.nativeEnum(ActorType).optional(),
  actor_info_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const IActorConditionDTOSchema = z.object({
  type: z.nativeEnum(ActorType).optional(),
  actor_info_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const IActorByActorInfoIdDTOSchema = z.object({
  actor_info_id: z.string().uuid(),
});

export type IActorCreateDTO = z.infer<typeof IActorCreateDTOSchema>;
export type IActorUpdateDTO = z.infer<typeof IActorUpdateDTOSchema>;
export type IActorConditionDTO = z.infer<typeof IActorConditionDTOSchema>;
export type IActorByActorInfoIdDTO = z.infer<typeof IActorByActorInfoIdDTOSchema>;

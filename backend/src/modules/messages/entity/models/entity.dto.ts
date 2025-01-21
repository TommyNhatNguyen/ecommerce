import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const IEntityCreateDTOSchema = z.object({
  kind: z.nativeEnum(EntityKind),
  type: z.string(),
  template: z.string(),
});

export const IEntityUpdateDTOSchema = z.object({
  kind: z.nativeEnum(EntityKind).optional(),
  type: z.string().optional(),
  template: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const IEntityConditionDTOSchema = z.object({
  kind: z.nativeEnum(EntityKind).optional(),
  type: z.string().optional(),
  template: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const IEntityByTypeAndKindDTOSchema = z.object({ 
  type: z.string(),
  kind: z.nativeEnum(EntityKind),
});

export type IEntityCreateDTO = z.infer<typeof IEntityCreateDTOSchema>;
export type IEntityUpdateDTO = z.infer<typeof IEntityUpdateDTOSchema>;
export type IEntityConditionDTO = z.infer<typeof IEntityConditionDTOSchema>;
export type IEntityByTypeAndKindDTO = z.infer<typeof IEntityByTypeAndKindDTOSchema>;

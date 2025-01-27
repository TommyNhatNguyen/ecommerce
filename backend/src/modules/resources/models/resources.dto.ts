import { ResourcesModelSchema } from 'src/modules/resources/models/resources.model';
import { ModelStatus, ResourcesType } from 'src/share/models/base-model';
import z from 'zod';

export const ResourcesCreateDTOSchema = z.object({
  type: z.nativeEnum(ResourcesType),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
});

export const ResourcesUpdateDTOSchema = ResourcesModelSchema.partial();

export const ResourcesConditionDTO = z.object({
  type: z.nativeEnum(ResourcesType).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type ResourcesCreateDTO = z.infer<typeof ResourcesCreateDTOSchema>;
export type ResourcesUpdateDTO = z.infer<typeof ResourcesUpdateDTOSchema>;
export type ResourcesConditionDTO = z.infer<typeof ResourcesConditionDTO>;

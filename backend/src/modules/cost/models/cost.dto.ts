import { CostSchema } from 'src/modules/cost/models/cost.model';
import { NumberType } from 'src/share/models/base-model';
import z from 'zod';

export const CostCreateDTOSchema = z.object({
  type: z.nativeEnum(NumberType),
  name: z.string(),
  cost: z.number().min(0).default(0),
  description: z.string().optional(),
});

export const CostUpdateDTOSchema = CostSchema.omit({
  id: true,
}).partial();

export const CostConditionDTOSchema = CostSchema.omit({
  id: true,
}).partial().extend({
  ids: z.array(z.string().uuid()).optional(),
});

export type CostCreateDTO = z.infer<typeof CostCreateDTOSchema>;
export type CostUpdateDTO = z.infer<typeof CostUpdateDTOSchema>;
export type CostConditionDTO = z.infer<typeof CostConditionDTOSchema>;

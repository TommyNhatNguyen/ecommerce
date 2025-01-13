import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const IShippingCreateDTOSchema = z.object({
  type: z.string(),
  cost: z.number().min(-1),
})

export const IShippingUpdateDTOSchema = z.object({
  type: z.string().optional(),
  cost: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const IShippingConditionDTOSchema = z.object({
  type: z.string().optional(), 
  minCost: z.number().optional(),
  maxCost: z.number().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type IShippingCreateDTO = z.infer<typeof IShippingCreateDTOSchema>;
export type IShippingUpdateDTO = z.infer<typeof IShippingUpdateDTOSchema>;
export type IShippingConditionDTO = z.infer<typeof IShippingConditionDTOSchema>;

import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const IPaymentMethodCreateDTOSchema = z.object({
  type: z.string(),
  cost: z.number().min(-1),
})

export const IPaymentMethodUpdateDTOSchema  = z.object({
  type: z.string().optional(),
  cost: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const IPaymentMethodConditionDTOSchema = z.object({
  type: z.string().optional(), 
  minCost: z.number().optional(),
  maxCost: z.number().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type IPaymentMethodCreateDTO = z.infer<typeof IPaymentMethodCreateDTOSchema>;
export type IPaymentMethodUpdateDTO = z.infer<typeof IPaymentMethodUpdateDTOSchema>;
export type IPaymentMethodConditionDTO = z.infer<typeof IPaymentMethodConditionDTOSchema>;
import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const PaymentCreateDTOSchema = z.object({
  type: z.string(),
  fee: z.number().min(-1),
})

export const PaymentUpdateDTOSchema = z.object({
  type: z.string().optional(),
  fee: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(), 
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const PaymentConditionDTOSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().optional(),
  fee: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(), 
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type PaymentCreateDTO = z.infer<typeof PaymentCreateDTOSchema>;
export type PaymentUpdateDTO = z.infer<typeof PaymentUpdateDTOSchema>;
export type PaymentConditionDTO = z.infer<typeof PaymentConditionDTOSchema>;
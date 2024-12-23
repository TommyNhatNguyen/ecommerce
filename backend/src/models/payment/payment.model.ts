import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const PaymentSchema = z.object({
  id: z.string().uuid(),  
  type: z.string(),
  fee: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Payment = z.infer<typeof PaymentSchema>;
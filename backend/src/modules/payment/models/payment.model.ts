import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  payment_method_id: z.string().uuid(),
  paid_amount: z.number().min(0),
  paid_all_date: z.string().datetime().nullable().default(null),
  status: z.nativeEnum(ModelStatus),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Payment = z.infer<typeof PaymentSchema>;
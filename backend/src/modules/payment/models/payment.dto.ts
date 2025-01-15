import { PaymentSchema } from 'src/modules/payment/models/payment.model';
import z from 'zod';

export const PaymentCreateDTOSchema = z.object({
  payment_method_id: z.string().uuid(),
  paid_amount: z.number().min(0),
  paid_all_date: z.date().nullable().default(null).optional(),
});

export const PaymentUpdateDTOSchema = PaymentSchema.omit({
  id: true,
}).partial();

export const PaymentConditionDTOSchema = PaymentSchema.omit({
  id: true,
}).partial();

export type PaymentCreateDTO = z.infer<typeof PaymentCreateDTOSchema>;
export type PaymentUpdateDTO = z.infer<typeof PaymentUpdateDTOSchema>;
export type PaymentConditionDTO = z.infer<typeof PaymentConditionDTOSchema>;

import { CustomerSchema } from 'src/modules/customer/models/customer.model';
import z from 'zod';

export const CustomerCreateDTOSchema = z.object({
  cart_id: z.string().uuid(),
  first_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
});

export const CustomerUpdateDTOSchema = CustomerSchema.omit({
  id: true,
}).partial();

export const CustomerConditionDTOSchema = CustomerSchema.omit({
  id: true,
}).partial();

export type CustomerCreateDTO = z.infer<typeof CustomerCreateDTOSchema>;
export type CustomerUpdateDTO = z.infer<typeof CustomerUpdateDTOSchema>;
export type CustomerConditionDTO = z.infer<typeof CustomerConditionDTOSchema>;

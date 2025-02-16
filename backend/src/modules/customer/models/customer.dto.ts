import { CustomerSchema } from "src/modules/customer/models/customer.model";
import z from "zod";

export const CustomerCreateDTOSchema = z.object({
  cart_id: z.string().uuid(),
  first_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
  username: z.string().optional(),
  hash_password: z.string().optional(),
  password: z.string().optional(),
});

export const ICustomerLoginDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const CustomerUpdateDTOSchema = CustomerSchema.omit({
  id: true,
}).partial();

export const CustomerConditionDTOSchema = z.object({
  cart_id: z.string().uuid().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15).optional(),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
  username: z.string().optional(),
});

export type CustomerCreateDTO = z.infer<typeof CustomerCreateDTOSchema>;
export type CustomerUpdateDTO = z.infer<typeof CustomerUpdateDTOSchema>;
export type CustomerConditionDTO = z.infer<typeof CustomerConditionDTOSchema>;
export type ICustomerLoginDTO = z.infer<typeof ICustomerLoginDTOSchema>;

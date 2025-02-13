import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  cart_id: z.string().uuid(),
  first_name: z.string().optional().nullable().default(null),
  last_name: z.string(),
  email: z.string().email().optional().nullable().default(null),
  phone: z.string().min(5).max(15),
  address: z.string().optional().nullable().default(null),
  city_id: z.string().uuid().optional().nullable().default(null),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  username: z.string(),
  hash_password: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;

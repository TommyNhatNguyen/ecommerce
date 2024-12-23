import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15),
  address: z.string().optional(),
  city_id: z.string().uuid(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Customer = z.infer<typeof CustomerSchema>;

import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const CustomerCreateDTOSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
});

export const CustomerUpdateDTOSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15).optional(),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const CustomerConditionDTOSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(15).optional(),
  address: z.string().optional(),
  city_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type CustomerCreateDTO = z.infer<typeof CustomerCreateDTOSchema>;
export type CustomerUpdateDTO = z.infer<typeof CustomerUpdateDTOSchema>;
export type CustomerConditionDTO = z.infer<typeof CustomerConditionDTOSchema>;
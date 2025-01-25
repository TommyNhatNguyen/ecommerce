import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const IUserLoginDTOSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const IUserCreateDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
  hash_password: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  role_id: z.string().uuid(),
});

export const IUserUpdateDTOSchema = z.object({
  username: z.string().optional(),
  hash_password: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  role_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const IUserConditionSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  role_id: z.string().uuid().optional(),
});

export type IUserCreateDTO = z.infer<typeof IUserCreateDTOSchema>;
export type IUserUpdateDTO = z.infer<typeof IUserUpdateDTOSchema>;
export type IUserConditionDTO = z.infer<typeof IUserConditionSchema>;
export type IUserLoginDTO = z.infer<typeof IUserLoginDTOSchema>;

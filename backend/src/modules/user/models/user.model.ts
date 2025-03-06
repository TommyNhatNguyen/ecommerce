import { roleModelName } from "src/modules/role/infras/repo/dto";
import { RoleSchema } from "src/modules/role/models/role.model";
import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  hash_password : z.string(),
  email: z.string().email(),
  phone: z.string(),
  role_id: z.string().uuid(),
  status: z.nativeEnum(ModelStatus),
  image_id: z.string().uuid().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  [roleModelName]: RoleSchema.optional(),
})

export const LoginResponseSchema = z.object({
  username: z.string(),
  role_id: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

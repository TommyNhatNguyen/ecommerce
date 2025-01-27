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
  created_at: z.date(),
  updated_at: z.date(),
})

export type User = z.infer<typeof UserSchema>

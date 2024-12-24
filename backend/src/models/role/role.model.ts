import { ModelStatus, Roles } from "src/share/models/base-model";
import z from "zod";

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.nativeEnum(Roles),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
})

export type Role = z.infer<typeof RoleSchema>

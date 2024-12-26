import { ModelStatus, Roles } from "src/share/models/base-model";
import z from "zod";

export const IRoleCreateDTOSchema = z.object({
  name: z.nativeEnum(Roles),
})

export const IRoleUpdateDTOSchema = z.object({
  name: z.nativeEnum(Roles).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const IRoleConditionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.nativeEnum(Roles).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type IRoleCreateDTO = z.infer<typeof IRoleCreateDTOSchema>
export type IRoleUpdateDTO = z.infer<typeof IRoleUpdateDTOSchema>
export type IRoleConditionDTO = z.infer<typeof IRoleConditionSchema>
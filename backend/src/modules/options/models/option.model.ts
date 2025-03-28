import { optionValueModelName } from 'src/modules/options/infras/repo/postgres/dto';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const OptionValueSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  value: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
});

export const OptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  label: z.string(),
  is_color: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
  [optionValueModelName]: z.array(OptionValueSchema),
});

export type Option = z.infer<typeof OptionSchema>;
export type OptionValue = z.infer<typeof OptionValueSchema>;

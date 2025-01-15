import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum DiscountScope {
  PRODUCT = 'product',
  ORDER = 'order',
}

export const DiscountSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  amount: z.number().min(0).default(0),
  type: z.nativeEnum(DiscountType),
  scope: z.nativeEnum(DiscountScope),
  start_date: z
    .string()
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: 'Invalid date format',
      }
    )
    .transform((dateString) => new Date(dateString)),
  end_date: z
    .string()
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: 'Invalid date format',
      }
    )
    .transform((dateString) => new Date(dateString)),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Discount = z.infer<typeof DiscountSchema>;

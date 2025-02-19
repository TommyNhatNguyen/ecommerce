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
  is_fixed: z.boolean().default(true),
  max_discount_count: z.number().min(0).optional(),
  discount_count: z.number().min(0).optional(),
  require_product_count: z.number().min(0).optional(),
  require_order_amount: z.number().min(0).optional(),
  is_free: z.boolean().default(false),
  has_max_discount_count: z.boolean().default(false),
  is_require_product_count: z.boolean().default(false),
  is_require_order_amount: z.boolean().default(false),
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

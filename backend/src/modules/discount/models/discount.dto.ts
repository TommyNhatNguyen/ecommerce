import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { DiscountType } from 'src/modules/discount/models/discount.model';
import { DiscountScope } from 'src/modules/discount/models/discount.model';

export const DiscountConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  name: z.string().optional(),
  scope: z.nativeEnum(DiscountScope).optional(),
  min_amount: z.number().optional(),
  max_amount: z.number().optional(),
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
    .optional(),
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
    .optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z
    .union([
      z.nativeEnum(BaseSortBy),
      z.literal('min_amount'),
      z.literal('max_amount'),
      z.literal('start_date'),
      z.literal('end_date'),
      z.literal('status'),
      z.literal('created_at'),
      z.literal('updated_at'),
      z.literal('amount'),
    ])
    .optional(),
});

export const DiscountCreateDTOSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    amount: z.number().min(0).default(0),
    is_fixed: z.boolean().optional(),
    max_discount_count: z.number().min(1).optional(),
    discount_count: z.number().min(0).optional(),
    require_product_count: z.number().min(0).optional(),
    require_order_amount: z.number().min(0).optional(),
    is_free: z.boolean().optional(),
    // Calculate based on max discount count
    has_max_discount_count: z.boolean().optional(),
    // Calculate based on require product count
    is_require_product_count: z.boolean().optional(),
    // Calculate based on require order amount
    is_require_order_amount: z.boolean().optional(),
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
  })
  .refine((data) => data.end_date > data.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

export const DiscountUpdateDTOSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().min(0).optional(),
    is_fixed: z.boolean().optional(),
    max_discount_count: z.number().min(0).optional(),
    discount_count: z.number().min(0).optional(),
    require_product_count: z.number().min(0).optional(),
    require_order_amount: z.number().min(0).optional(),
    is_free: z.boolean().optional(),
    has_max_discount_count: z.boolean().optional(),
    is_require_product_count: z.boolean().optional(),
    is_require_order_amount: z.boolean().optional(),
    scope: z.nativeEnum(DiscountScope).optional(),
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
      .transform((dateString) => new Date(dateString))
      .optional(),
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
      .transform((dateString) => new Date(dateString))
      .optional(),
    status: z.nativeEnum(ModelStatus).optional(),
  })
  .refine(
    (data) =>
      !data.start_date || !data.end_date || data.end_date > data.start_date,
    {
      message: 'End date must be after start date',
      path: ['end_date'],
    }
  );

export type DiscountCreateDTO = z.infer<typeof DiscountCreateDTOSchema>;
export type DiscountUpdateDTO = z.infer<typeof DiscountUpdateDTOSchema>;
export type DiscountConditionDTO = z.infer<typeof DiscountConditionDTOSchema>;

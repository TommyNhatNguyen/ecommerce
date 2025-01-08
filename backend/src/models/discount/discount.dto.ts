import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';

export const DiscountConditionDTOSchema = z.object({
  name: z.string().optional(),
  min_discount_percentage: z.number().optional(),
  max_discount_percentage: z.number().optional(),
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
      z.literal('min_discount_percentage'),
      z.literal('max_discount_percentage'),
      z.literal('start_date'),
      z.literal('end_date'),
      z.literal('status'),
      z.literal('created_at'),
      z.literal('updated_at'),
      z.literal('discount_percentage'),
    ])
    .optional(),
});

export const DiscountCreateDTOSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .default(() => uuidv7()),
    name: z.string(),
    description: z.string().optional(),
    discount_percentage: z.number().min(0).max(100).default(0),
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
          console.log(value);
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
    discount_percentage: z.number().min(0).max(100).optional(),
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

export type DiscountCreateDTOSchema = z.infer<typeof DiscountCreateDTOSchema>;
export type DiscountUpdateDTOSchema = z.infer<typeof DiscountUpdateDTOSchema>;
export type DiscountConditionDTOSchema = z.infer<
  typeof DiscountConditionDTOSchema
>;

import { ModelStatus, OrderState } from 'src/share/models/base-model';
import z from 'zod';

export const OrderCreateDTOSchema = z.object({
  customer_id: z.string().uuid(),
  shipping_phone: z.string().min(5).max(15),
  shipping_email: z.string().email().nullable().optional(),
  shipping_address: z.string(),
  order_state: z.nativeEnum(OrderState).default(OrderState.PENDING).optional(),
  total_price: z.number().min(0),
  shipping_method_id: z.string().uuid(),
  payment_method_id: z.string().uuid(),
  has_paid: z.boolean().optional().default(false),
  product_orders: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().min(1),
      subtotal: z.number().min(0),
    })
  ),
});

export const OrderUpdateDTOSchema = z.object({
  shipping_phone: z.string().min(5).max(15).optional(),
  shipping_email: z.string().email().nullable().optional(),
  shipping_address: z.string().optional(),
  customer_id: z.string().uuid().optional(),
  order_state: z.nativeEnum(OrderState).optional(),
  total_price: z.number().min(0).optional(),
  shipping_method_id: z.string().uuid().optional(),
  payment_method_id: z.string().uuid().optional(),
  has_paid: z.boolean().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  product_orders: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().min(1),
        subtotal: z.number().min(0),
      })
    )
    .optional(),
});

export const OrderConditionDTOSchema = z.object({
  shipping_phone: z.string().min(5).max(15).optional(),
  shipping_email: z.string().email().nullable().optional(),
  shipping_address: z.string().optional(),
  order_state: z.nativeEnum(OrderState).optional(),
  total_price: z.number().min(0).optional(),
  min_total_price: z.number().min(0).optional(),
  max_total_price: z.number().min(0).optional(),
  customer_id: z.string().uuid().optional(),
  has_paid: z.boolean().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type OrderCreateDTO = z.infer<typeof OrderCreateDTOSchema>;
export type OrderUpdateDTO = z.infer<typeof OrderUpdateDTOSchema>;
export type OrderConditionDTO = z.infer<typeof OrderConditionDTOSchema>;

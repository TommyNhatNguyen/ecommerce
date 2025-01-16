import { OrderDetailSchema } from 'src/modules/order_detail/models/order_detail.model';
import { NumberType } from 'src/share/models/base-model';
import z from 'zod';

export const OrderDetailCreateDTOSchema = z.object({
  subtotal: z.number(),
  total_shipping_fee: z.number().default(0),
  total_payment_fee: z.number().default(0),
  total_costs: z.number().default(0),
  total: z.number().default(0),
  shipping_method_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  payment_info: z.object({
    payment_method_id: z.string().uuid(),
    paid_amount: z.number(),
  }),
  customer_id: z.string().uuid().optional(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_email: z.string().optional(),
  customer_address: z.string(),
  costs_detail: z.array(
    z.object({
      id: z.string().uuid(),
      cost_type: z.nativeEnum(NumberType),
      cost_amount: z.number().default(0),
      cost_name: z.string().optional(),
    })
  ).optional(),
  products_detail: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number(),
    })
  ),
});

export const OrderDetailAddProductsDTOSchema = z.object({
  quantity: z.number(),
  price: z.number(),
  subtotal: z.number(),
  discount_amount: z.number().default(0),
});

export const OrderDetailUpdateDTOSchema = OrderDetailSchema.omit({
  id: true,
}).partial();

export const OrderDetailConditionDTOSchema = OrderDetailSchema.omit({
  id: true,
}).partial();

export type OrderDetailCreateDTO = z.infer<typeof OrderDetailCreateDTOSchema>;
export type OrderDetailUpdateDTO = z.infer<typeof OrderDetailUpdateDTOSchema>;
export type OrderDetailConditionDTO = z.infer<
  typeof OrderDetailConditionDTOSchema
>;
export type OrderDetailAddProductsDTO = z.infer<
  typeof OrderDetailAddProductsDTOSchema
>;

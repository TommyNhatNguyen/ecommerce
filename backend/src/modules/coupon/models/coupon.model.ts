import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';
import { ModelStatus } from 'src/share/models/base-model';
import { z } from 'zod';

export const CouponSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  code: z.string(),
  discount_id: z.string().uuid(),
  [discountModelName]: DiscountSchema,
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Coupon = z.infer<typeof CouponSchema>;
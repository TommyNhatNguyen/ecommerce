import { z } from 'zod';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';
import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';

export const CouponCreateDTOSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  discount_id: z.string().uuid(),
});

export const CouponUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  discount_id: z.string().uuid().optional()
});

export const CouponConditionDTOSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  discount_id: z.string().uuid().optional(),
  include_discount: z.boolean().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
});

export type CouponCreateDTO = z.infer<typeof CouponCreateDTOSchema>;
export type CouponUpdateDTO = z.infer<typeof CouponUpdateDTOSchema>;
export type CouponConditionDTO = z.infer<typeof CouponConditionDTOSchema>;

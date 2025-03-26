import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventorySchema } from 'src/modules/inventory/models/inventory.model';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { ProductSellableSchema } from 'src/modules/product_sellable/models/product-sellable.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const VariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
  [productSellableModelName]: ProductSellableSchema.optional(),
});

export const VariantOptionValueSchema = z.object({
  id: z.string().uuid(),
  variant_id: z.string().uuid(),
  option_value_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
});

export type Variant = z.infer<typeof VariantSchema>;
export type VariantOptionValue = z.infer<typeof VariantOptionValueSchema>;

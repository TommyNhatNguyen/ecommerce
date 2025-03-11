import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { cartProductModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartProductSellableSchema } from 'src/modules/cart/models/cart.model';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { ProductSellableSchema } from 'src/modules/product_sellable/models/product-sellable.model';
import { variantModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';
import { ImageSchema } from 'src/modules/image/models/image.model';

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OVER_STOCK = 'OVER_STOCK',
}

export const InventoryWarehouseSchema = z.object({
  inventory_id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  quantity: z.number().min(0),
  cost: z.number().min(0),
  total_cost: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export const InventorySchema = z.object({
  id: z.string().uuid(),
  total_quantity: z.number().min(0),
  total_cost: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  stock_status: z.nativeEnum(StockStatus),
  low_stock_threshold: z.number().min(0),
  high_stock_threshold: z.number().min(0),
  note: z.string().optional(),
  [productSellableModelName]: z.object({
    id: z.string().uuid(),
    price: z.number().nonnegative().min(0),
    total_discounts: z.number().nonnegative().min(0),
    price_after_discounts: z.number().nonnegative().min(0),
    variant_id: z.string().uuid(),
    status: z.nativeEnum(ModelStatus),
    created_at: z.date(),
    updated_at: z.date(),
    [discountModelName]: z.array(DiscountSchema).optional(),
    [imageModelName]: z.array(ImageSchema).optional(),
    [variantModelName]: z.object({
      id: z.string().uuid(),
      name: z.string(),
      created_at: z.date(),
      updated_at: z.date(),
      status: z.nativeEnum(ModelStatus),
    }),
  }),
});
export type Inventory = z.infer<typeof InventorySchema>;
export type InventoryWarehouse = z.infer<typeof InventoryWarehouseSchema>;
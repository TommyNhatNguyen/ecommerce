import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ImageModel } from "@/app/shared/models/images/images.model";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { CartProductSellableModel } from "../cart/cart.model";

export type ProductSellableModel = {
  id: string;
  price: number;
  total_discounts: number;
  price_after_discounts: number;
  status: ModelStatus;
  created_at: Date;
  updated_at: Date;
  inventory?: InventoryModel;
  discount?: DiscountModel[];
  image?: ImageModel[];
  variant?: VariantProductModel;
  cart_product_sellable?: CartProductSellableModel
};

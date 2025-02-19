import { IDiscountUseCase } from 'src/modules/discount/models/discount.interface';
import { IImageCloudinaryRepository } from '@models/image/image.interface';
import { IDiscountRepository } from 'src/modules/discount/models/discount.interface';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { IProductSellableRepository } from 'src/modules/product_sellable/models/product-sellable.interface';

import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { IProductUseCase } from 'src/modules/products/models/product.interface';
import {
  ProductSellableConditionDTO,
  ProductSellableCreateDTO,
  ProductSellableDiscountCreateDTO,
  ProductSellableImageCreateDTO,
  ProductSellableUpdateDTO,
  ProductSellableVariantCreateDTO,
} from 'src/modules/product_sellable/models/product-sellable.dto';
import { ProductSellable } from 'src/modules/product_sellable/models/product-sellable.model';
import { PagingDTO } from 'src/share/models/paging';
import { ListResponse } from 'src/share/models/base-model';

export class ProductSellableUseCase implements IProductSellableUseCase {
  constructor(
    private readonly repository: IProductSellableRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository,
    private readonly productSellableDiscountRepository: IProductSellableRepository,
    private readonly inventoryUseCase: IInventoryUseCase,
    private readonly productSellableVariantRepository?: IProductSellableRepository,
    private readonly discountRepository?: IDiscountRepository,
    private readonly imageRepository?: IProductSellableRepository,
    private readonly discountUseCase?: IDiscountUseCase
  ) {}

  async createNewProductSellable(
    data: Omit<
      ProductSellableCreateDTO,
      'total_discounts' | 'price_after_discounts'
    >
  ): Promise<ProductSellable> {
    let total_discounts: number = 0;
    let price_after_discounts = data.price;
    let payload: ProductSellableCreateDTO = {
      ...data,
      total_discounts,
      price_after_discounts,
    };
    // --- DISCOUNT ---
    if (data.discountIds && data.discountIds.length > 0) {
      const discountList = await this.discountUseCase?.listDiscount(
        { page: 1, limit: data.discountIds.length },
        { ids: data.discountIds }
      );
      payload.total_discounts =
        data.price *
          ((discountList?.data || [])
            ?.filter((item) => !item.is_fixed)
            ?.map((item) => item.amount)
            ?.reduce((arr, curr) => arr + curr, 0) / 100 || 0) +
        ((discountList?.data || [])
          ?.filter((item) => item.is_fixed)
          ?.map((item) => item.amount)
          ?.reduce((arr, curr) => arr + curr, 0) || 0);
      payload.price_after_discounts = data.price - payload.total_discounts;
    }
    const productSellable = await this.repository.insert(payload);
    if (data.discountIds && data.discountIds.length > 0) {
      await this.productSellableDiscountRepository.addDiscounts(
        data.discountIds.map((id) => ({
          product_sellable_id: productSellable.id,
          discount_id: id,
        }))
      );
    }

    // --- INVENTORY ---
    await this.inventoryUseCase.createInventory({
      product_sellable_id: productSellable.id,
      quantity: data.quantity ?? 0,
      low_stock_threshold: data.low_stock_threshold ?? 0,
      cost: data.cost ?? 0,
      total_value: (data.cost ?? 0) * (data.quantity ?? 0),
    });

    // --- IMAGE ---
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageRepository?.addImages(
        data.imageIds.map((id) => ({
          product_sellable_id: productSellable.id,
          image_id: id,
        }))
      );
    }
    return productSellable;
  }

  async updateProductSellable(
    id: string,
    data: ProductSellableUpdateDTO
  ): Promise<ProductSellable> {
    return await this.repository.update(id, data);
  }
  async deleteProductSellable(id: string): Promise<boolean> {
    const product = await this.repository.get(id, { includeImage: true });
    if (product?.image?.length && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (image) => {
          await this.cloudinaryImageRepository.delete(image.cloudinary_id);
        })
      );
    }
    await this.repository.delete(id);
    return true;
  }

  async getProductSellables(
    condition: ProductSellableConditionDTO,
    paging: PagingDTO
  ): Promise<ListResponse<ProductSellable[]>> {
    const data = await this.repository.list(condition, paging);
    return data;
  }

  async getProductSellableById(
    id: string,
    condition: ProductSellableConditionDTO
  ): Promise<ProductSellable | null> {
    return await this.repository.get(id, condition);
  }
}

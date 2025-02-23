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
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { Transaction } from 'sequelize';
import {
  Discount,
  DiscountScope,
} from 'src/modules/discount/models/discount.model';
import { PRODUCT_SELLABLE_DISCOUNT_DATE_ERROR } from 'src/modules/product_sellable/models/product-sellable.error';
import { CronJob } from 'cron';
import { DiscountCalculatorUsecaseImpl } from 'src/modules/order_detail/usecase/DiscountCalculatorUsecase';

export class ProductSellableUseCase implements IProductSellableUseCase {
  constructor(
    private readonly repository: IProductSellableRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository,
    private readonly productSellableDiscountRepository: IProductSellableRepository,
    private readonly inventoryUseCase: IInventoryUseCase,
    private readonly discountUseCase: IDiscountUseCase,
    private readonly productSellableVariantRepository?: IProductSellableRepository,
    private readonly discountRepository?: IDiscountRepository,
    private readonly imageRepository?: IProductSellableRepository
  ) {}
  async updateProductSellableDiscountsEveryDay(): Promise<boolean> {
    // Get all product sellables
    // Check if the product sellable has a discount
    // If it does, check if the discount is expired
    // If it is, update the discount
    // If it is not, do nothing
    // Return true if the discount is updated, false otherwise
    const productSellables = await this.getProductSellables(
      { includeDiscount: true },
      { page: 1, limit: 100 }
    );
    for (const productSellable of productSellables.data) {
      const discount = productSellable.discount;
      discount?.forEach(async (item) => {
        const newTotalDiscounts = 0;
        const newPriceAfterDiscount = 0;
        if (new Date(item.end_date) < new Date()) {
          await this.updateProductSellable(productSellable.id, {
            discountIds: [],
          });
        }
      });
    }
    return true;
  }

  async createNewProductSellable(
    data: Omit<
      ProductSellableCreateDTO,
      'total_discounts' | 'price_after_discounts'
    >,
    t?: Transaction
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
        {
          ids: data.discountIds,
          scope: DiscountScope.PRODUCT,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          status: ModelStatus.ACTIVE,
        }
      );
      const applyDiscountList: Discount[] = (discountList?.data || []).filter(
        (item) => !item.is_require_product_count
      );
      payload.total_discounts = applyDiscountList.reduce((acc, discount) => {
        const calculator = new DiscountCalculatorUsecaseImpl(
          discount,
          this.discountUseCase
        );
        return (
          acc + calculator.calculateDiscountAmountForProduct(1, data.price)
        );
      }, 0);
      payload.price_after_discounts = Math.max(
        data.price - payload.total_discounts,
        0
      );
    }
    const productSellable = await this.repository.insert(payload, t);
    if (data.discountIds && data.discountIds.length > 0) {
      await this.productSellableDiscountRepository.addDiscounts(
        data.discountIds.map((id) => ({
          product_sellable_id: productSellable.id,
          discount_id: id,
        })),
        t
      );
    }

    // --- INVENTORY ---
    await this.inventoryUseCase.createInventory(
      {
        product_sellable_id: productSellable.id,
        quantity: data.quantity ?? 0,
        low_stock_threshold: data.low_stock_threshold ?? 0,
        cost: data.cost ?? 0,
        total_value: (data.cost ?? 0) * (data.quantity ?? 0),
      },
      t
    );

    // --- IMAGE ---
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageRepository?.addImages(
        data.imageIds.map((id) => ({
          product_sellable_id: productSellable.id,
          image_id: id,
        })),
        t
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

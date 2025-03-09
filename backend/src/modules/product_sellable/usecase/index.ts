import { IDiscountUseCase } from 'src/modules/discount/models/discount.interface';
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
import { IImageCloudinaryRepository } from 'src/modules/image/models/image.interface';

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
  async updateProductSellableDiscounts(
    t?: Transaction,
    noUpdateDiscountCount: boolean = false
  ): Promise<boolean> {
    const productSellables = await this.getProductSellables({
      get_all: true,
      includeDiscount: true,
    });

    for (const productSellable of productSellables.data) {
      const applyDiscountList: Discount[] = (
        productSellable.discount || []
      ).filter(
        (item) =>
          !item.is_require_product_count ||
          item.require_product_count == 1 ||
          item.is_free
      );

      const total_discounts = await applyDiscountList.reduce(
        async (accPromise, discount) => {
          const acc = await accPromise;
          const calculator = new DiscountCalculatorUsecaseImpl(
            discount,
            this.discountUseCase
          );
          const amount = await calculator.calculateDiscountAmountForProduct(
            1,
            productSellable.price,
            noUpdateDiscountCount
          );
          return acc + amount;
        },
        Promise.resolve(0)
      );

      const price_after_discounts = Math.max(
        productSellable.price - total_discounts,
        0
      );
      console.log(
        '🚀 ~ ProductSellableUseCase ~ updateProductSellableDiscounts ~ total_discounts:',
        total_discounts,
        productSellable.price,
        price_after_discounts
      );
      await this.updateProductSellable(
        productSellable.id,
        {
          total_discounts: total_discounts,
          price_after_discounts: price_after_discounts,
        },
        t
      );
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
        (item) => !item.is_require_product_count || item.is_free
      );
      payload.total_discounts = await applyDiscountList.reduce(
        async (accPromise, discount) => {
          const acc = await accPromise;
          const calculator = new DiscountCalculatorUsecaseImpl(
            discount,
            this.discountUseCase
          );
          const amount = await calculator.calculateDiscountAmountForProduct(
            1,
            data.price,
            true
          );
          return acc + amount;
        },
        Promise.resolve(0)
      );
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
        inventory_warehouse: data.inventory_quantity_by_warehouse ?? [],
        low_stock_threshold: data.low_stock_threshold ?? 0,
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
    data: ProductSellableUpdateDTO,
    t?: Transaction
  ): Promise<ProductSellable> {
    return await this.repository.update(id, data, t);
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
    paging?: PagingDTO
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

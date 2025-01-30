import { IImageCloudinaryRepository } from "@models/image/image.interface";
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductGetStatsDTO,
  ProductStatsSortBy,
  ProductUpdateDTOSchema,
} from "../models/product.dto";
import {
  IProductRepository,
  IProductUseCase,
} from "../models/product.interface";
import { Product } from "../models/product.model";
import {
  BaseOrder,
  ListResponse,
  ModelStatus,
} from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";
import {
  IDiscountRepository,
  IDiscountUseCase,
} from "src/modules/discount/models/discount.interface";
import { DISCOUNT_NOT_FOUND_ERROR } from "src/modules/products/models/errors";
import { IInventoryUseCase } from "src/modules/inventory/models/inventory.interface";

export class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository,
    private readonly productCategoryRepository: IProductRepository,
    private readonly productDiscountRepository: IProductRepository,
    private readonly inventoryUseCase: IInventoryUseCase,
    private readonly productVariantRepository?: IProductRepository,
    private readonly discountRepository?: IDiscountRepository,
    private readonly imageRepository?: IProductRepository,
    private readonly discountUseCase?: IDiscountUseCase
  ) {}
  async getTotalInventoryByGroup(condition?: ProductGetStatsDTO): Promise<any> {
    return await this.repository.getTotalInventoryByGroup(condition);
  }
  async countTotalProduct(): Promise<number> {
    return await this.repository.countTotalProduct();
  }
  async updateProduct(
    id: string,
    data: ProductUpdateDTOSchema
  ): Promise<Product> {
    return await this.repository.update(id, data);
  }
  async deleteProduct(id: string): Promise<boolean> {
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
  async getProducts(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const data = await this.repository.list(condition, paging);
    if (
      condition.sortBy === ProductStatsSortBy.INVENTORY_VALUE &&
      data.data.length > 0
    ) {
      const inventoryValue = data.data.map((item, index) => ({
        inventory_value:
          item.inventory?.quantity || 0 * (item.inventory?.cost || 0),
        index,
      }));
      const sortedIndex = inventoryValue
        .sort((a, b) => {
          if (condition.order === BaseOrder.ASC) {
            return b.inventory_value - a.inventory_value;
          }
          return a.inventory_value - b.inventory_value;
        })
        .map((item) => item.index);
      return {
        ...data,
        data: sortedIndex.map((index) => data.data[index]),
      };
    }
    return data;
  }
  async getProductById(
    id: string,
    condition: ProductConditionDTOSchema
  ): Promise<Product | null> {
    return await this.repository.get(id, condition);
  }
  async createNewProduct(
    data: Omit<
      ProductCreateDTOSchema,
      "total_discounts" | "price_after_discounts"
    >
  ): Promise<Product> {
    let total_discounts: number = 0;
    let price_after_discounts = data.price;
    let payload: ProductCreateDTOSchema = {
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
            .filter((item) => item.type === "percentage")
            .map((item) => item.amount)
            .reduce((arr, curr) => arr + curr) /
            100) +
        (discountList?.data || [])
          .filter((item) => item.type === "fixed")
          .map((item) => item.amount)
          .reduce((arr, curr) => arr + curr);
      payload.price_after_discounts = data.price - payload.total_discounts;
    }
    const product = await this.repository.insert(payload);
    if (data.discountIds) {
      await this.productDiscountRepository.addDiscounts(
        data.discountIds.map((id) => ({
          product_id: product.id,
          discount_id: id,
        }))
      );
    }

    // --- INVENTORY ---
    await this.inventoryUseCase.createInventory({
      product_id: product.id,
      quantity: data.quantity ?? 0,
      low_stock_threshold: data.low_stock_threshold ?? 0,
      cost: data.cost ?? 0,
      total_value: (data.cost ?? 0) * (data.quantity ?? 0),
    });
    // --- CATEGORY ---
    if (data.categoryIds && data.categoryIds.length > 0) {
      await this.productCategoryRepository.addCategories(
        data.categoryIds.map((id) => ({
          product_id: product.id,
          category_id: id,
        }))
      );
    }
    // --- IMAGE ---
    if (data.imageIds && data.imageIds.length > 0) {
      await this.imageRepository?.addImages(
        data.imageIds.map((id) => ({
          product_id: product.id,
          image_id: id,
        }))
      );
    }
    // --- VARIANTS ---
    if (data.variantIds && this.productVariantRepository && data.variantIds.length > 0) {
      await this.productVariantRepository.addVariants(
        data.variantIds.map((id) => ({
          product_id: product.id,
          variant_id: id,
        }))
      );
    }
    return product;
  }
}

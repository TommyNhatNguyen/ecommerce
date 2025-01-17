import { IImageCloudinaryRepository } from '@models/image/image.interface';
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductGetStatsDTO,
  ProductStatsSortBy,
  ProductUpdateDTOSchema,
} from '../product/product.dto';
import {
  IProductRepository,
  IProductUseCase,
} from '../product/product.interface';
import { Product } from '../product/product.model';
import {
  BaseOrder,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { IDiscountRepository } from 'src/modules/discount/models/discount.interface';
import { DISCOUNT_NOT_FOUND_ERROR } from 'src/modules/products/product/errors';

export class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly cloudinaryImageRepository: IImageCloudinaryRepository,
    private readonly productCategoryRepository: IProductRepository,
    private readonly productDiscountRepository: IProductRepository,
    private readonly discountRepository?: IDiscountRepository
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
  async createNewProduct(data: ProductCreateDTOSchema): Promise<Product> {
    const product = await this.repository.insert(data);
    // --- CATEGORY ---
    if (data.categoryIds) {
      await this.productCategoryRepository.addCategories(
        data.categoryIds.map((id) => ({
          product_id: product.id,
          category_id: id,
        }))
      );
    }
    // --- DISCOUNT ---
    if (data.discountIds) {
      const discounts = await this.discountRepository?.list(
        {
          page: 1,
          limit: data.discountIds.length,
        },
        {
          ids: data.discountIds,
        }
      );
      if (!discounts || discounts.data.length !== data.discountIds.length) {
        throw DISCOUNT_NOT_FOUND_ERROR;
      }
      await this.productDiscountRepository.addDiscounts(
        data.discountIds.map((id) => ({
          product_id: product.id,
          discount_id: id,
          price_after_discount:
            product.price -
            (discounts.data.find((discount) => discount.id === id)?.amount ||
              0),
        }))
      );
    }
    return product;
  }
}

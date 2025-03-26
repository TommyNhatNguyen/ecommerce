import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductGetStatsDTO,
  ProductStatsSortBy,
  ProductUpdateDTOSchema,
} from '../models/product.dto';
import {
  IProductRepository,
  IProductUseCase,
} from '../models/product.interface';
import { Product } from '../models/product.model';
import {
  BaseOrder,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  IDiscountRepository,
  IDiscountUseCase,
} from 'src/modules/discount/models/discount.interface';
import { DISCOUNT_NOT_FOUND_ERROR } from 'src/modules/products/models/errors';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { IVariantUseCase } from 'src/modules/variant/models/variant.interface';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { Op, Sequelize, Transaction } from 'sequelize';
import { IBrandUseCase } from 'src/modules/brand/models/brand.interface';

export class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly productCategoryRepository: IProductRepository,
    private readonly variantUseCase: IVariantUseCase,
    private readonly productSellableUseCase: IProductSellableUseCase,
    private readonly brandUseCase: IBrandUseCase,
    private readonly sequelize: Sequelize
  ) {}

  async bulkSoftDelete(ids: string[], t?: Transaction): Promise<boolean> {
    return await this.repository.bulkSoftDelete(ids, t);
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
    await this.repository.delete(id);
    return true;
  }
  async getProducts(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const data = await this.repository.list(condition, paging);
    return data;
  }
  async getProductById(
    id: string,
    condition: ProductConditionDTOSchema
  ): Promise<Product | null> {
    return await this.repository.get(id, condition);
  }
  async createNewProduct(data: ProductCreateDTOSchema): Promise<Product> {
    const { variants, ...rest } = data;
    const product = await this.repository.insert(rest);
    try {
      const result = await this.sequelize.transaction(async (t) => {
        // --- CATEGORY ---
        if (data.categoryIds && data.categoryIds.length > 0) {
          await this.productCategoryRepository.addCategories(
            data.categoryIds.map((id) => ({
              product_id: product.id,
              category_id: id,
            })),
            t
          );
        }
        // --- VARIANT AND PRODUCT SELLABLE ---
        if (variants && variants.length > 0) {
          for (const variant of variants) {
            const variantData = await this.variantUseCase.createVariant(
              {
                ...variant.variant_data,
                product_id: product.id,
              },
              t
            );
          }
        }
        return product;
      });
      return result;
    } catch (error) {
      console.log('🚀 ~ ProductUseCase ~ createNewProduct ~ error:', error);
      throw error;
    }
  }
}

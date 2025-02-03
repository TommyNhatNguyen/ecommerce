import { PagingDTO } from 'src/share/models/paging';
import { Sequelize, Op, Model, Includeable } from 'sequelize';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/infras/repository/category/dto';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
  ModelStatus,
} from 'src/share/models/base-model';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';

import {
  discountModelName,
  DiscountPersistence,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import {
  inventoryModelName,
  InventoryPersistence,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  reviewModelName,
  ReviewPersistence,
} from 'src/infras/repository/review/dto';
import sequelize from 'sequelize';
import {
  ProductCategoryCreateDTO,
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductStatsSortBy,
  ProductStatsType,
  ProductUpdateDTOSchema,
} from 'src/modules/products/models/product.dto';
import { IProductRepository } from 'src/modules/products/models/product.interface';
import { Product } from 'src/modules/products/models/product.model';
import { productModelName } from 'src/modules/products/infras/repo/postgres/dto';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { CustomerPersistence } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import {
  productSellableModelName,
  ProductSellablePersistence,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  optionsModelName,
  OptionsPersistence,
  optionValueModelName,
  OptionValuePersistence,
} from 'src/modules/options/infras/repo/postgres/dto';

export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async addCategories(data: ProductCategoryCreateDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }

  async countTotalProduct(): Promise<number> {
    const count = await this.sequelize.models[this.modelName].count();
    return count;
  }

  async get(
    id: string,
    condition?: ProductConditionDTOSchema
  ): Promise<Product | null> {
    const include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        exclude: [...EXCLUDE_ATTRIBUTES],
      },
    ];

    if (condition?.includeCategory) {
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }

    if (condition?.includeVariant) {
      include.push({
        model: VariantPersistence,
        as: variantModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
      });
    }

    const data = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return data ? data.dataValues : null;
  }

  async list(
    condition: ProductConditionDTOSchema,
    paging: PagingDTO
  ): Promise<ListResponse<Product[]>> {
    const { page, limit } = paging;
    const where: any = {
      status: { [Op.not]: ModelStatus.DELETED },
    };
    const order = condition?.order || BaseOrder.DESC;
    let sortBy: any = condition?.sortBy || BaseSortBy.CREATED_AT;
    let customOrder: any = '';

    if (condition.name) where.name = { [Op.iLike]: condition.name };
    if (condition.status) where.status = condition.status;
    if (condition.status === ModelStatus.DELETED) {
      where.status = { [Op.eq]: ModelStatus.DELETED };
    }
    if (condition.ids) {
      where.id = { [Op.in]: condition.ids };
    }
    if (condition.fromCreatedAt && condition.toCreatedAt) {
      where.created_at = {
        [Op.between]: [
          new Date(condition.fromCreatedAt),
          new Date(condition.toCreatedAt),
        ],
      };
    } else {
      if (condition.fromCreatedAt) {
        where.created_at = { [Op.gte]: new Date(condition.fromCreatedAt) };
      }
      if (condition.toCreatedAt) {
        where.created_at = { [Op.lte]: new Date(condition.toCreatedAt) };
      }
    }
    const include: Includeable[] = [];
    const variantInclude: Includeable[] = [];
    const variantInfoInclude: Includeable[] = [];
    const optionValueInclude: Includeable[] = [];
    if (condition.includeCategory) {
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }

    if (condition.includeReview) {
      include.push({
        model: ReviewPersistence,
        as: reviewModelName,
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
      });
    }

    if (condition.includeVariant) {
      if (condition.includeVariantInfo) {
        if (condition.includeVariantInventory) {
          variantInfoInclude.push({
            model: InventoryPersistence,
            as: inventoryModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          });
        }
        if (condition.includeImage) {
          variantInfoInclude.push({
            model: ImagePersistence,
            as: imageModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          });
        }
        if (condition.includeDiscount) {
          variantInfoInclude.push({
            model: DiscountPersistence,
            as: discountModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          });
        }
        variantInclude.push({
          model: ProductSellablePersistence,
          as: productSellableModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          include: variantInfoInclude,
        });
      }
      if (condition.includeVariantOption) {
        if (condition.includeVariantOptionType) {
          optionValueInclude.push({
            model: OptionsPersistence,
            as: optionsModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          });
        }
        variantInclude.push({
          model: OptionValuePersistence,
          as: optionValueModelName,
          attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
          through: { attributes: [] },
          include: optionValueInclude,
        });
      }
      include.push({
        model: VariantPersistence,
        as: variantModelName,
        include: variantInclude,
      });
    }

    const { rows: productRows, count: countRows } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: customOrder ? customOrder : [[sortBy, order]],
      distinct: true,
      include,
    });
    const rows = productRows.map((row) => row.dataValues);
    const count = countRows;

    return {
      data: rows,
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }

  async insert(data: ProductCreateDTOSchema): Promise<Product> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result.dataValues as Product;
  }

  async update(id: string, data: ProductUpdateDTOSchema): Promise<Product> {
    const { categoryIds, ...rest } = data;
    const result = await this.sequelize.models[this.modelName].update(rest, {
      where: { id },
      returning: true,
    });
    const updatedProduct: any = await this.sequelize.models[
      productModelName
    ].findByPk(id);
    if (typeof categoryIds === 'object') {
      await updatedProduct.setCategory(categoryIds);
    }
    return result[1][0].dataValues;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}


import { PagingDTO } from 'src/share/models/paging';
import { Sequelize, Op, Model } from 'sequelize';
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
} from 'src/infras/repository/variant/dto';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import {
  inventoryModelName,
  InventoryPersistence,
} from 'src/infras/repository/inventory/dto';
import {
  reviewModelName,
  ReviewPersistence,
} from 'src/infras/repository/review/dto';
import sequelize from 'sequelize';
import { ProductCategoryCreateDTO, ProductConditionDTOSchema, ProductCreateDTOSchema, ProductStatsSortBy, ProductStatsType, ProductUpdateDTOSchema } from 'src/modules/products/product/product.dto';
import { IProductRepository } from 'src/modules/products/product/product.interface';
import { ProductGetStatsDTO } from 'src/modules/products/product/product.dto';
import { Product } from 'src/modules/products/product/product.model';
import { productModelName } from 'src/modules/products/infras/repo/postgres/dto';

export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async addCategories(data: ProductCategoryCreateDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }
  async getTotalInventoryByGroup(condition?: ProductGetStatsDTO): Promise<any> {
    let attributes: any[] = [];
    let group: any[] = [];
    let include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        attributes: [],
      },
    ];
    if (condition?.groupBy === ProductStatsType.CATEGORY) {
      group.push('category.name');
      attributes.push([sequelize.col('category.name'), 'name']);
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: [],
        through: { attributes: [] },
      });
    }
    if (condition?.groupBy === ProductStatsType.DISCOUNT) {
      group.push('discount.name');
      attributes.push([sequelize.col('discount.name'), 'name']);
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: [],
        through: { attributes: [] },
      });
    }
    if (condition?.groupBy === ProductStatsType.STATUS) {
      group.push('product.status');
      attributes.push([sequelize.col('product.status'), 'name']);
    }
    if (condition?.groupBy === ProductStatsType.STOCK_STATUS) {
      group.push('inventory.stock_status');
      attributes.push([sequelize.col('inventory.stock_status'), 'name']);
    }
    const data = await this.sequelize.models[this.modelName].findAll({
      attributes: [
        ...attributes,
        [sequelize.fn('SUM', sequelize.col('inventory.quantity')), 'total'],
        [
          sequelize.fn(
            'COUNT',
            sequelize.fn('DISTINCT', sequelize.col('product.id'))
          ),
          'product_count',
        ],
      ],
      group: group,
      raw: true,
      include: include,
    });
    console.log(data);
    return data;
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
        exclude: [...EXCLUDE_ATTRIBUTES, 'product_id'],
      },
    ];
    if (condition?.includeDiscount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
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
        through: { attributes: [] },
      });
    }
    if (condition?.includeImage) {
      include.push({
        model: ImagePersistence,
        as: imageModelName,
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
        through: { attributes: [] },
      });
    }
    if (condition?.includeReview) {
      include.push({
        model: ReviewPersistence,
        as: reviewModelName,
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
    let sortBy: any =
      (condition?.sortBy != ProductStatsSortBy.INVENTORY_QUANTITY &&
        condition?.sortBy != ProductStatsSortBy.INVENTORY_VALUE &&
        condition?.sortBy != ProductStatsSortBy.DISCOUNT_PERCENTAGE &&
        condition?.sortBy) ||
      BaseSortBy.CREATED_AT;
    let customOrder: any = '';
    const inventorySortBy = condition?.sortBy ==
      ProductStatsSortBy.INVENTORY_QUANTITY && [
      { model: InventoryPersistence, as: inventoryModelName },
      condition?.sortBy.split('_')[1],
    ];
    const discountSortBy = condition?.sortBy ==
      ProductStatsSortBy.DISCOUNT_PERCENTAGE && [
      { model: DiscountPersistence, as: discountModelName },
      condition?.sortBy,
    ];
    if (inventorySortBy) {
      customOrder = [[...inventorySortBy, order]];
    }
    if (discountSortBy) {
      customOrder = [[...discountSortBy, order]];
      condition.includeDiscount = true;
    }
    if (condition.maxPrice) where.price = { [Op.lte]: condition.maxPrice };
    if (condition.minPrice)
      where.price = { ...where.price, [Op.gte]: condition.minPrice };
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
    const include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'product_id'],
        },
      },
    ];

    if (condition.includeDiscount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    if (condition.includeCategory) {
      include.push({
        model: CategoryPersistence,
        as: categoryModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    if (condition.includeVariant) {
      include.push({
        model: VariantPersistence,
        as: variantModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
      });
    }
    if (condition.includeImage) {
      include.push({
        model: ImagePersistence,
        as: imageModelName,
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'] },
        through: { attributes: [] },
      });
    }
    if (condition.includeReview) {
      include.push({
        model: ReviewPersistence,
        as: reviewModelName,
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'product_id', 'id'] },
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
    const {
      discountIds,
      variantIds,
      imageIds,
      quantity,
      ...rest
    } = data;
    const payload = { ...rest };
    const result = await this.sequelize.models[this.modelName].create(payload, {
      returning: true,
    });
    const createdProduct: any = await this.sequelize.models[
      productModelName
    ].findByPk(rest.id, {
      include: [
        {
          model: InventoryPersistence,
          as: inventoryModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
        },
      ],
    });
    if (discountIds) {
      await createdProduct.setDiscount(discountIds);
    }
    if (variantIds) {
      await createdProduct.setVariant(variantIds);
    }
    if (imageIds) {
      await createdProduct.setImage(imageIds);
    }
    return result.dataValues as Product;
  }

  async update(id: string, data: ProductUpdateDTOSchema): Promise<Product> {
    const {
      categoryIds,
      discountIds,
      variantIds,
      imageIds,
      quantity,
      ...rest
    } = data;
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
    if (typeof discountIds === 'object') {
      await updatedProduct.setDiscount(discountIds);
    }
    if (typeof variantIds === 'object') {
      await updatedProduct.setVariant(variantIds);
    }
    if (typeof imageIds === 'object') {
      await updatedProduct.setImage(imageIds);
    }
    return result[1][0].dataValues;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}

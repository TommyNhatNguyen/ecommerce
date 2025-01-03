import { IProductRepository } from '@models/product/product.interface';
import {
  ProductConditionDTOSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from '@models/product/product.dto';
import { Product } from '@models/product/product.model';
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
  productCategoryModelName,
  productDiscountModelName,
  ProductDiscountPersistence,
  productModelName,
} from 'src/infras/repository/product/dto';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/infras/repository/discount/dto';
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

export class PostgresProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async get(
    id: string,
    condition?: ProductConditionDTOSchema
  ): Promise<Product | null> {
    const include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        attributes: ['quantity'],
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
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;

    if (condition.maxPrice) where.price = { [Op.lte]: condition.maxPrice };
    if (condition.minPrice)
      where.price = { ...where.price, [Op.gte]: condition.minPrice };
    if (condition.name) where.name = { [Op.iLike]: condition.name };
    if (condition.status) where.status = condition.status;
    if (condition.status === ModelStatus.DELETED) {
      where.status = { [Op.eq]: ModelStatus.DELETED };
    }
    const include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        attributes: ['quantity'],
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
      order: [[sortBy, order]],
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
      categoryIds,
      discountIds,
      variantIds,
      imageIds,
      quantity,
      ...rest
    } = data;
    const payload = { ...data, [inventoryModelName]: { quantity } };
    const result = await this.sequelize.models[this.modelName].create(payload, {
      include: [
        {
          model: InventoryPersistence,
          as: inventoryModelName,
          attributes: ['quantity'],
        },
      ],
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
    if (categoryIds) {
      await createdProduct.setCategory(categoryIds);
    }
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
    if (typeof quantity === 'number') {
      const inventory = await updatedProduct.getInventory();
      await inventory.update({ quantity: quantity });
    }
    return result[1][0].dataValues;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}

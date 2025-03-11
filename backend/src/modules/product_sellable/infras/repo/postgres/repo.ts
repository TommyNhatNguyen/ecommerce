import { Includeable, Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize';
import { ImagePersistence } from 'src/modules/image/infras/repo/dto';
import { imageModelName } from 'src/modules/image/infras/repo/dto';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import {
  inventoryModelName,
  InventoryPersistence,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  ProductSellableConditionDTO,
  ProductSellableCreateDTO,
  ProductSellableUpdateDTO,
  ProductSellableVariantCreateDTO,
} from 'src/modules/product_sellable/models/product-sellable.dto';
import {
  ProductSellableDiscountCreateDTO,
  ProductSellableImageCreateDTO,
} from 'src/modules/product_sellable/models/product-sellable.dto';
import { IProductSellableRepository } from 'src/modules/product_sellable/models/product-sellable.interface';
import { ProductSellable } from 'src/modules/product_sellable/models/product-sellable.model';
import { ProductStatsSortBy } from 'src/modules/products/models/product.dto';
import { BaseSortBy } from 'src/share/models/base-model';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { BaseOrder } from 'src/share/models/base-model';
import { ModelStatus } from 'src/share/models/base-model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  optionsModelName,
  OptionsPersistence,
  optionValueModelName,
} from 'src/modules/options/infras/repo/postgres/dto';
import { OptionValuePersistence } from 'src/modules/options/infras/repo/postgres/dto';
import { productModelName } from 'src/modules/products/infras/repo/postgres/dto';
import { ProductPersistence } from 'src/modules/products/infras/repo/postgres/dto';
import { Transaction } from 'sequelize';

export class PostgresProductSellableRepository
  implements IProductSellableRepository
{
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async addVariants(
    data: ProductSellableVariantCreateDTO[],
    t?: Transaction
  ): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].bulkCreate(data, {
        transaction: t,
      });
    } else {
      await this.sequelize.models[this.modelName].bulkCreate(data);
    }
    return true;
  }
  async addImages(
    data: ProductSellableImageCreateDTO[],
    t?: Transaction
  ): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].bulkCreate(data, {
        transaction: t,
      });
    } else {
      await this.sequelize.models[this.modelName].bulkCreate(data);
    }
    return true;
  }
  async addDiscounts(
    data: ProductSellableDiscountCreateDTO[],
    t?: Transaction
  ): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].bulkCreate(data, {
        transaction: t,
      });
    } else {
      await this.sequelize.models[this.modelName].bulkCreate(data);
    }
    return true;
  }

  async get(
    id: string,
    condition?: ProductSellableConditionDTO,
    t?: Transaction
  ): Promise<ProductSellable | null> {
    const include: any[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        exclude: [...EXCLUDE_ATTRIBUTES, 'product_sellable_id'],
      },
    ];
    const variantInclude: Includeable[] = [
      {
        model: OptionValuePersistence,
        as: optionValueModelName.toLowerCase(),
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: [
          {
            model: OptionsPersistence,
            as: optionsModelName.toLowerCase(),
            attributes: { exclude: EXCLUDE_ATTRIBUTES },
          },
        ],
      },
    ];
    if (condition?.includeProduct) {
      variantInclude.push({
        model: ProductPersistence,
        as: productModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
      });
    }
    if (condition?.includeDiscount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
        where: {
          start_date: {
            [Op.lte]: new Date(),
          },
          end_date: {
            [Op.gte]: new Date(),
          },
          status: {
            [Op.eq]: ModelStatus.ACTIVE,
          },
        },
      });
    }
    if (condition?.includeVariant) {
      include.push({
        model: VariantPersistence,
        as: variantModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: variantInclude,
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
    const data = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
      transaction: t,
    });
    return data ? data.dataValues : null;
  }

  async list(
    condition: ProductSellableConditionDTO,
    paging: PagingDTO
  ): Promise<ListResponse<ProductSellable[]>> {
    const where: any = {
      status: { [Op.not]: ModelStatus.DELETED },
    };
    const order = condition?.order || BaseOrder.DESC;
    let sortBy: any = condition?.sortBy || BaseSortBy.CREATED_AT;
    let customOrder: any = '';
    if (condition.maxPrice) where.price = { [Op.lte]: condition.maxPrice };
    if (condition.minPrice)
      where.price = { ...where.price, [Op.gte]: condition.minPrice };
    if (condition.status) where.status = condition.status;
    if (condition.status === ModelStatus.DELETED) {
      where.status = { [Op.eq]: ModelStatus.DELETED };
    }
    if (condition.ids) {
      where.id = { [Op.in]: condition.ids };
    }
    if (condition.variant_ids) {
      where.variant_id = { [Op.in]: condition.variant_ids };
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
    const include: Includeable[] = [
      {
        model: InventoryPersistence,
        as: inventoryModelName,
        attributes: {
          exclude: [...EXCLUDE_ATTRIBUTES, 'product_sellable_id'],
        },
      },
    ];
    const variantInclude: Includeable[] = [
      {
        model: OptionValuePersistence,
        as: optionValueModelName.toLowerCase(),
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: [
          {
            model: OptionsPersistence,
            as: optionsModelName.toLowerCase(),
            attributes: { exclude: EXCLUDE_ATTRIBUTES },
          },
        ],
      },
    ];
    if (condition.includeDiscount) {
      let discountWhere: WhereOptions = {
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
        status: {
          [Op.eq]: ModelStatus.ACTIVE,
        },
      };
      if (condition.discount_ids && condition.discount_ids.length > 0) {
        discountWhere.id = {
          [Op.in]: condition.discount_ids,
        };
      }
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        through: { attributes: [] },
        required: false,
        where: discountWhere,
      });
    }

    if (condition.includeVariant) {
      if (condition?.includeProduct) {
        variantInclude.push({
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
        });
      }
      include.push({
        model: VariantPersistence,
        as: variantModelName.toLowerCase(),
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: variantInclude,
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

    if (condition.get_all) {
      const productSellables = await this.sequelize.models[
        this.modelName
      ].findAll({
        where,
        include,
        order: customOrder ? customOrder : [[sortBy, order]],
      });
      return {
        data: productSellables.map(
          (productSellable) => productSellable.dataValues
        ),
        meta: {
          limit: productSellables.length,
          total_count: productSellables.length,
          current_page: 1,
          total_page: 1,
        },
      };
    }
    const { page, limit } = paging;
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

  async insert(
    data: ProductSellableCreateDTO,
    t?: Transaction
  ): Promise<ProductSellable> {
    const { inventory_quantity_by_warehouse, ...rest } = data;
    const payload = { ...rest };
    if (t) {
      const result = await this.sequelize.models[this.modelName].create(
        payload,
        {
          returning: true,
          transaction: t,
        }
      );
      return result.dataValues;
    } else {
      const result = await this.sequelize.models[this.modelName].create(
        payload,
        {
          returning: true,
        }
      );
      return result.dataValues;
    }
  }

  async update(
    id: string,
    data: ProductSellableUpdateDTO,
    t?: Transaction
  ): Promise<ProductSellable> {
    const { discountIds, variantIds, imageIds, inventory_quantity_by_warehouse, ...rest } = data;
    const result = await this.sequelize.models[this.modelName].update(rest, {
      where: { id },
      returning: true,
      transaction: t,
    });
    const updatedProduct: any = await this.sequelize.models[
      this.modelName
    ].findByPk(id);
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

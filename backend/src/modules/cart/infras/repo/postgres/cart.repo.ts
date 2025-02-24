import { Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { Includeable, Sequelize } from 'sequelize';
import {
  imageModelName,
  ImagePersistence,
} from 'src/infras/repository/image/dto';
import {
  CartAddProductsSellableDTO,
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
  CartUpdateProductSellableDTO,
} from 'src/modules/cart/models/cart.dto';
import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import { Cart } from 'src/modules/cart/models/cart.model';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { CustomerPersistence } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import {
  optionsModelName,
  OptionsPersistence,
  optionValueModelName,
  OptionValuePersistence,
} from 'src/modules/options/infras/repo/postgres/dto';
import {
  ProductSellablePersistence,
  productSellableModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  variantModelName,
  variantOptionValueModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresCartRepository implements ICartRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async updateProducts(data: CartUpdateProductSellableDTO): Promise<boolean> {
    const response = await this.sequelize.models[this.modelName].update(data, {
      where: {
        cart_id: data.cart_id,
        product_sellable_id: data.product_sellable_id,
      },
    });
    return true;
  }

  async addProducts(data: CartAddProductsSellableDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async getById(
    id: string,
    condition: CartConditionDTO,
    t?: Transaction
  ): Promise<Cart> {
    const include: Includeable[] = [];
    if (condition.include_products) {
      include.push({
        model: ProductSellablePersistence,
        as: productSellableModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: [
          {
            model: ImagePersistence,
            as: imageModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'] },
            through: { attributes: [] },
          },
          {
            model: VariantPersistence,
            as: variantModelName,
            attributes: { exclude: EXCLUDE_ATTRIBUTES },
            include: [
              {
                model: OptionValuePersistence,
                as: optionValueModelName.toLowerCase(),
                through: {
                  attributes: [],
                },
                include: [
                  {
                    model: OptionsPersistence,
                    as: optionsModelName.toLowerCase(),
                  },
                ],
              },
            ],
          },
          {
            model: DiscountPersistence,
            as: discountModelName,
            attributes: { exclude: EXCLUDE_ATTRIBUTES },
            required: false,
            through: {
              attributes: [],
              as: 'order_discounts',
            },
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
          },
        ],
      });
    }
    if (condition.include_customer) {
      include.push({
        model: CustomerPersistence,
        as: customerModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
      });
    }
    if (t) {
      const cart = await this.sequelize.models[this.modelName].findByPk(id, {
        include: include,
        transaction: t,
      });
      return cart?.dataValues || null;
    }
    const cart = await this.sequelize.models[this.modelName].findByPk(id, {
      include: include,
    });
    return cart?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: CartConditionDTO
  ): Promise<ListResponse<Cart[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      // where: condition,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      include: [
        {
          model: ProductSellablePersistence,
          as: productSellableModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
        },
      ],
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async create(data: CartCreateDTO, t?: Transaction): Promise<Cart> {
    if (t) {
      const cart = await this.sequelize.models[this.modelName].create(data, {
        returning: true,
        transaction: t,
      });
      return cart.dataValues;
    }
    const cart = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return cart.dataValues;
  }
  async update(id: string, data: CartUpdateDTO): Promise<Cart> {
    const cart = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return cart[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}

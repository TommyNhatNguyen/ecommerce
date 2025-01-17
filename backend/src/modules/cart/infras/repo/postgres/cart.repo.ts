import { Sequelize } from 'sequelize';
import {
  productModelName,
  ProductPersistence,
} from 'src/infras/repository/product/dto';
import {
  CartAddProductsDTO,
  CartConditionDTO,
  CartCreateDTO,
  CartUpdateDTO,
} from 'src/modules/cart/models/cart.dto';
import { ICartRepository } from 'src/modules/cart/models/cart.interface';
import { Cart } from 'src/modules/cart/models/cart.model';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresCartRepository implements ICartRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async addProducts(data: CartAddProductsDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }
  async getById(id: string, condition: CartConditionDTO): Promise<Cart> {
    const cart = await this.sequelize.models[this.modelName].findByPk(id);
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
          model: ProductPersistence,
          as: productModelName,
          attributes: { exclude: EXCLUDE_ATTRIBUTES },
          through: {
            attributes: ['quantity', 'subtotal', 'discount_amount', 'total'],
          },
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
  async create(data: CartCreateDTO): Promise<Cart> {
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

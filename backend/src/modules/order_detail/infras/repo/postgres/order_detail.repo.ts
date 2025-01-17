import { Sequelize } from 'sequelize';
import {
  productModelName,
  ProductPersistence,
} from 'src/modules/products/infras/repo/postgres/dto';
import { costModelName, CostPersistence } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { orderDetailProductModelName } from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailProductPersistence } from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import {
  OrderDetailAddCostsDTO,
  OrderDetailAddDiscountsDTO,
  OrderDetailAddProductsDTO,
  OrderDetailConditionDTO,
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { IOrderDetailRepository } from 'src/modules/order_detail/models/order_detail.interface';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresOrderDetailRepository implements IOrderDetailRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(
    id: string,
    condition: OrderDetailConditionDTO
  ): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].findByPk(id);
    return order?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>> {
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
          attributes: ['id', 'name'],
          through: {
            attributes: [
              'quantity',
              'price',
              'subtotal',
              'discount_amount',
              'total',
            ],
            as: 'order_product_details',
          },
        },
        {
          model: DiscountPersistence,
          as: discountModelName,
          attributes: ['id', 'name', 'amount'],
          through: {
            attributes: [],
            as: 'order_discounts',
          },
        },
        {
          model: CostPersistence,
          as: costModelName,
          attributes: ['id', 'name', 'cost'],
          through: {
            attributes: [],
            as: 'order_costs',
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
  async create(data: OrderDetailCreateDTO): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return order.dataValues;
  }

  async addProducts(data: OrderDetailAddProductsDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }

  async addDiscounts(data: OrderDetailAddDiscountsDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }

  async addCosts(data: OrderDetailAddCostsDTO[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data);
    return true;
  }

  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return order[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}

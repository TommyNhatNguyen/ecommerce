import { Op, Sequelize } from 'sequelize';
import {
  productModelName,
  ProductPersistence,
} from 'src/modules/products/infras/repo/postgres/dto';
import {
  costModelName,
  CostPersistence,
} from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
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
import { ListResponse, ModelStatus } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  shippingModelName,
  ShippingPersistence,
} from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import {
  paymentModelName,
  PaymentPersistence,
} from 'src/modules/payment/infras/repo/postgres/payment.dto';
import {
  productSellableModelName,
  ProductSellablePersistence,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { Transaction } from 'sequelize';

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
          model: ProductSellablePersistence,
          as: productSellableModelName,
          attributes: {
            exclude: [...EXCLUDE_ATTRIBUTES],
          }
        },
        {
          model: DiscountPersistence,
          as: discountModelName,
          attributes: [...EXCLUDE_ATTRIBUTES],
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
      order: [['created_at', 'DESC']],
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
  async create(
    data: OrderDetailCreateDTO,
    t: Transaction
  ): Promise<OrderDetail> {
    const order = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
      transaction: t,
    });
    return order.dataValues;
  }

  async addProducts(
    data: OrderDetailAddProductsDTO[],
    t: Transaction
  ): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data, {
      transaction: t,
    });
    return true;
  }

  async addDiscounts(
    data: OrderDetailAddDiscountsDTO[],
    t: Transaction
  ): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data, {
      transaction: t,
    });
    return true;
  }

  async addCosts(
    data: OrderDetailAddCostsDTO[],
    t: Transaction
  ): Promise<boolean> {
    await this.sequelize.models[this.modelName].bulkCreate(data, {
      transaction: t,
    });
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

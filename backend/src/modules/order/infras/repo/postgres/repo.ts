import { IOrderRepository } from 'src/modules/order/models/order.interface';
import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from 'src/modules/order/models/order.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { IncludeOptions, Sequelize } from 'sequelize';
import { Order } from 'src/modules/order/models/order.model';
import {
  orderDetailModelName,
  OrderDetailPersistence,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { productModelName } from 'src/modules/products/infras/repo/postgres/dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { ProductPersistence } from 'src/modules/products/infras/repo/postgres/dto';
import { DiscountPersistence } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { CostPersistence } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { costModelName } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { shippingModelName } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { ShippingPersistence } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { PaymentPersistence } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import { paymentModelName } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import {
  paymentMethodModelName,
  PaymentMethodPersistence,
} from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { ImagePersistence } from 'src/infras/repository/image/dto';
import { imageModelName } from 'src/infras/repository/image/dto';
export class PostgresOrderRepository implements IOrderRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    const include: IncludeOptions[] = [];
    const orderDetailInclude: IncludeOptions[] = [];
    if (condition.includeCost) {
      orderDetailInclude.push({
        model: CostPersistence,
        as: costModelName,
        attributes: ['id', 'name', 'cost'],
        through: {
          attributes: [],
          as: 'order_costs',
        },
      });
    }
    if (condition.includeDiscount) {
      orderDetailInclude.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: ['id', 'name', 'amount', 'type', 'scope'],
        through: {
          attributes: [],
          as: 'order_discounts',
        },
      });
    }
    if (condition.includeProducts) {
      orderDetailInclude.push({
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
          as: 'product_details',
        },
        include: [
          {
            model: ImagePersistence,
            as: imageModelName,
            attributes: {
              exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'],
            },
            through: { attributes: [] },
          },
          {
            model: DiscountPersistence,
            as: discountModelName,
            attributes: ['id', 'name', 'amount', 'type', 'scope'],
            through: { attributes: [] },
          },
        ],
      });
    }
    if (condition.includeShipping) {
      orderDetailInclude.push({
        model: ShippingPersistence,
        as: shippingModelName,
        attributes: ['id', 'type', 'cost'],
      });
    }
    if (condition.includePayment) {
      orderDetailInclude.push({
        model: PaymentPersistence,
        as: paymentModelName,
        attributes: ['id', 'paid_amount', 'paid_all_date'],
        include: [
          {
            model: PaymentMethodPersistence,
            as: paymentMethodModelName,
            attributes: ['id', 'type', 'cost'],
          },
        ],
      });
    }
    if (condition.includeOrderDetail) {
      include.push({
        model: OrderDetailPersistence,
        as: orderDetailModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: orderDetailInclude,
      });
    }
    const order = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return order?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>> {
    const include: IncludeOptions[] = [];
    const orderDetailInclude: IncludeOptions[] = [];
    if (condition.includeCost) {
      orderDetailInclude.push({
        model: CostPersistence,
        as: costModelName,
        attributes: ['id', 'name', 'cost'],
        through: {
          attributes: [],
          as: 'order_costs',
        },
      });
    }
    if (condition.includeDiscount) {
      orderDetailInclude.push({
        model: DiscountPersistence,
        as: discountModelName,
        attributes: ['id', 'name', 'amount', 'type', 'scope'],
        through: {
          attributes: [],
          as: 'order_discounts',
        },
      });
    }
    if (condition.includeProducts) {
      orderDetailInclude.push({
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
          as: 'product_details',
        },
        include: [
          {
            model: ImagePersistence,
            as: imageModelName,
            attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'cloudinary_id'] },
            through: { attributes: [] },
          },
          {
            model: DiscountPersistence,
            as: discountModelName,
            attributes: ['id', 'name', 'amount', 'type', 'scope'],
            through: { attributes: [] },
          },
        ],
      });
    }
    if (condition.includeShipping) {
      orderDetailInclude.push({
        model: ShippingPersistence,
        as: shippingModelName,
        attributes: ['id', 'type', 'cost'],
      });
    }
    if (condition.includePayment) {
      orderDetailInclude.push({
        model: PaymentPersistence,
        as: paymentModelName,
        attributes: ['id', 'paid_amount', 'paid_all_date'],
        include: [
          {
            model: PaymentMethodPersistence,
            as: paymentMethodModelName,
            attributes: ['id', 'type', 'cost'],
          },
        ],
      });
    }
    if (condition.includeOrderDetail) {
      include.push({
        model: OrderDetailPersistence,
        as: orderDetailModelName,
        attributes: { exclude: EXCLUDE_ATTRIBUTES },
        include: orderDetailInclude,
      });
    }
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      // where: condition,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      include,
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
  async create(data: OrderCreateDTO): Promise<Order> {
    const order: any = await this.sequelize.models[this.modelName].create(
      data,
      {
        returning: true,
      }
    );
    return order.dataValues;
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    const order: any = await this.sequelize.models[this.modelName].update(
      data,
      {
        where: { id },
        returning: true,
      }
    );
    return order[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    const order = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}

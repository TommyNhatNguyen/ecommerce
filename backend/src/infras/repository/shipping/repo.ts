import {
  IShippingCreateDTO,
  IShippingUpdateDTO,
  IShippingConditionDTO,
} from '@models/shipping/shipping.dto';
import { IShippingRepository } from '@models/shipping/shipping.interface';
import { Shipping } from '@models/shipping/shipping.model';
import { Op, Sequelize } from 'sequelize';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresShippingRepository implements IShippingRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async createShipping(data: IShippingCreateDTO): Promise<Shipping> {
    const shipping = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return shipping.dataValues;
  }
  async updateShipping(
    id: string,
    data: IShippingUpdateDTO
  ): Promise<Shipping> {
    console.log(id);
    const shipping = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return shipping[1][0].dataValues;
  }
  async deleteShipping(id: string): Promise<boolean> {
    const shipping = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
  async getShippingById(
    id: string,
    condition: IShippingConditionDTO
  ): Promise<Shipping | null> {
    const where: any = { };
    const { type, minCost, maxCost, status, created_at, updated_at } = condition || {};
    if (type) where.type = type;
    if (minCost) where.cost = { [Op.gte]: minCost };
    if (maxCost) where.cost = { [Op.lte]: maxCost };
    if (status) where.status = status;
    if (created_at) where.created_at = created_at;
    if (updated_at) where.updated_at = updated_at;
    const shipping = await this.sequelize.models[this.modelName].findByPk(id, where);
    console.log(shipping);
    return shipping?.dataValues;
  }
  async getShippingList(
    paging: PagingDTO,
    condition: IShippingConditionDTO
  ): Promise<ListResponse<Shipping[]>> {
    const { page, limit } = paging;
    const where: any = {};
    if (condition.type) where.type = condition.type;
    if (condition.minCost) where.cost = { [Op.gte]: condition.minCost };
    if (condition.maxCost) where.cost = { [Op.lte]: condition.maxCost };
    if (condition.status) where.status = condition.status;
    if (condition.created_at) where.created_at = condition.created_at;
    if (condition.updated_at) where.updated_at = condition.updated_at;
    const shipping = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({ where, limit, offset: (page - 1) * limit });
    return {
      data: shipping.rows.map((row) => row.dataValues),
      meta: {
        total_count: shipping.count,
        current_page: page,
        total_page: Math.ceil(shipping.count / limit),
        limit,
      },
    };
  }
}

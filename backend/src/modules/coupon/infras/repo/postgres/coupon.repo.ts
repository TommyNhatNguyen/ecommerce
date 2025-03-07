import {
  Includeable,
  Op,
  Sequelize,
  Transaction,
  WhereOptions,
} from 'sequelize';
import {
  CouponConditionDTO,
  CouponCreateDTO,
  CouponUpdateDTO,
} from 'src/modules/coupon/models/coupon.dto';
import { ICouponRepository } from 'src/modules/coupon/models/coupon.interface';
import { Coupon } from 'src/modules/coupon/models/coupon.model';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresCouponRepository implements ICouponRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async list(
    paging: PagingDTO,
    condition?: CouponConditionDTO
  ): Promise<ListResponse<Coupon[]>> {
    const { page, limit } = paging || {};
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { include_discount } = condition || {};
    const include: Includeable[] = [];
    const where: WhereOptions = {};
    if (include_discount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
      });
    }
    if (condition?.status) {
      where.status = {
        [Op.eq]: condition.status,
      };
    }

    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      include,
      offset: (page - 1) * limit,
      limit,
      distinct: true,
      order: [[sortBy, order]],
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async get(
    id: string,
    condition?: CouponConditionDTO
  ): Promise<Coupon | null> {
    const { include_discount } = condition || {};
    const include: Includeable[] = [];
    if (include_discount) {
      include.push({
        model: DiscountPersistence,
        as: discountModelName,
      });
    }
    const coupon = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return coupon?.dataValues || null;
  }
  async insert(data: CouponCreateDTO, t?: Transaction): Promise<Coupon> {
    if (t) {
      const coupon = await this.sequelize.models[this.modelName].create(data, {
        transaction: t,
        returning: true,
      });
      return coupon.dataValues;
    }
    const coupon = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return coupon.dataValues;
  }
  async update(
    id: string,
    data: CouponUpdateDTO,
    t?: Transaction
  ): Promise<Coupon> {
    if (t) {
      const coupon = await this.sequelize.models[this.modelName].update(data, {
        where: { id },
        returning: true,
        transaction: t,
      });
      return coupon[1][0].dataValues;
    }
    const coupon = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return coupon[1][0].dataValues;
  }
  async delete(id: string, t?: Transaction): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].destroy({
        where: { id },
        transaction: t,
      });
    } else {
      await this.sequelize.models[this.modelName].destroy({
        where: { id },
      });
    }
    return true;
  }
}

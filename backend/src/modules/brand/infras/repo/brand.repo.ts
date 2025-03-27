import { Sequelize } from 'sequelize';
import {
  BrandConditionDTO,
  BrandCreateDTO,
  BrandUpdateDTO,
} from 'src/modules/brand/models/brand.dto';
import { IBrandRepository } from 'src/modules/brand/models/brand.interface';
import { Brand } from 'src/modules/brand/models/brand.model';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

class PostgresBrandRepository implements IBrandRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async deleteBulk(ids: string[]): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id: ids } });
    return true;
  }

  async getAll(condition?: BrandConditionDTO): Promise<Brand[]> {
    const brands = await this.sequelize.models[this.modelName].findAll({
      where: condition,
    });
    return brands.map((brand) => brand.dataValues);
  }
  async get(id: string, condition?: BrandConditionDTO): Promise<Brand | null> {
    const brand = await this.sequelize.models[this.modelName].findByPk(id);
    return brand ? brand.dataValues : null;
  }
  async list(
    paging: PagingDTO,
    condition?: BrandConditionDTO
  ): Promise<ListResponse<Brand[]>> {
    const { page, limit } = paging;
    const { sortBy = BaseSortBy.CREATED_AT, order = BaseOrder.DESC } =
      condition || {};
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit: limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit: limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async insert(data: BrandCreateDTO): Promise<Brand> {
    const brand = await this.sequelize.models[this.modelName].create(data);
    return brand.dataValues;
  }
  async update(id: string, data: BrandUpdateDTO): Promise<Brand> {
    const brand = await this.sequelize.models[this.modelName].findByPk(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await brand.update(data);
    return brand.dataValues;
  }
  async delete(id: string): Promise<boolean> {
    const brand = await this.sequelize.models[this.modelName].findByPk(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await brand.destroy();
    return true;
  }
}

export default PostgresBrandRepository;

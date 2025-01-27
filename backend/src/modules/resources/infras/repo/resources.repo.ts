import { Sequelize } from 'sequelize';
import {
  ResourcesConditionDTO,
  ResourcesCreateDTO,
  ResourcesUpdateDTO,
} from 'src/modules/resources/models/resources.dto';
import { IResourcesRepository } from 'src/modules/resources/models/resources.interface';
import { ResourcesModel } from 'src/modules/resources/models/resources.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class ResourcesRepository implements IResourcesRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async getResourcesById(
    id: string,
    condition?: ResourcesConditionDTO
  ): Promise<ResourcesModel | null> {
    const resources = await this.sequelize.models[this.modelName].findOne({
      where: { id },
    });
    return resources?.dataValues;
  }

  async getResources(
    paging: PagingDTO,
    condition?: ResourcesConditionDTO
  ): Promise<ListResponse<ResourcesModel[]>> {
    const { limit, page } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
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

  async createResources(data: ResourcesCreateDTO): Promise<ResourcesModel> {
    const resources = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return resources.dataValues;
  }

  async updateResources(
    id: string,
    data: ResourcesUpdateDTO
  ): Promise<ResourcesModel> {
    const resources = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return resources[1][0].dataValues;
  }

  async deleteResources(id: string): Promise<boolean> {
    const resources = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return resources > 0;
  }
}

import { Sequelize } from 'sequelize';
import {
  IEntityConditionDTO,
  IEntityCreateDTO,
  IEntityUpdateDTO,
} from 'src/modules/messages/entity/models/entity.dto';
import { IEntityRepository } from 'src/modules/messages/entity/models/entity.interface';
import { Entity, EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresEntityRepository implements IEntityRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async createEntity(data: IEntityCreateDTO): Promise<Entity> {
    const entity = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return entity.dataValues;
  }
  async updateEntity(id: string, data: IEntityUpdateDTO): Promise<Entity> {
    const entity = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return entity[1][0].dataValues;
  }
  async deleteEntity(id: string): Promise<boolean> {
    const entity = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return entity > 0;
  }
  async getEntityById(
    id: string,
    condition: IEntityConditionDTO
  ): Promise<Entity | null> {
    const entity = await this.sequelize.models[this.modelName].findOne({
      where: { id },
    });
    return entity?.dataValues || null;
  }
  async getEntityList(
    paging: PagingDTO,
    condition: IEntityConditionDTO
  ): Promise<ListResponse<Entity[]>> {
    const { page, limit } = paging;
    const where: any = {};
    if (condition.type) where.type = condition.type;
    if (condition.kind) where.kind = condition.kind;
    if (condition.status) where.status = condition.status;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
        limit,
      },
    };
  }
  async getEntityByTypeAndKind(
    type: string,
    kind: EntityKind
  ): Promise<Entity | null> {
    const entity = await this.sequelize.models[this.modelName].findOne({
      where: { type, kind },
    });
    return entity?.dataValues || null;
  }
}

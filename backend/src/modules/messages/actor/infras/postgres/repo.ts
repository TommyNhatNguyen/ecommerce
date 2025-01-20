import { Sequelize } from 'sequelize';
import {
  IActorCreateDTO,
  IActorUpdateDTO,
  IActorConditionDTO,
} from 'src/modules/messages/actor/models/actor.dto';
import { IActorRepository } from 'src/modules/messages/actor/models/actor.interface';
import { Actor } from 'src/modules/messages/actor/models/actor.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresActorRepository implements IActorRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async createActor(data: IActorCreateDTO): Promise<Actor> {
    const actor = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return actor.dataValues;
  }
  async updateActor(id: string, data: IActorUpdateDTO): Promise<Actor> {
    const actor = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return actor[1][0].dataValues;
  }
  async deleteActor(id: string): Promise<boolean> {
    const actor = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return actor > 0;
  }
  async getActorById(
    id: string,
    condition: IActorConditionDTO
  ): Promise<Actor | null> {
    const actor = await this.sequelize.models[this.modelName].findOne({
      where: { id },
    });
    return actor?.dataValues || null;
  }
  async getActorList(
    paging: PagingDTO,
    condition: IActorConditionDTO
  ): Promise<ListResponse<Actor[]>> {
    const { page, limit } = paging;
    const where: any = {};
    if (condition.type) where.type = condition.type;
    if (condition.actor_id) where.actor_id = condition.actor_id;
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
}

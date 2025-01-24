import { Sequelize } from 'sequelize';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { ActorPersistence } from 'src/modules/messages/actor/infras/postgres/dto';
import {
  entityModelName,
  EntityPersistence,
} from 'src/modules/messages/entity/infras/postgres/dto';
import {
  IMessageCreateDTO,
  IMessageUpdateDTO,
  IMessageConditionDTO,
} from 'src/modules/messages/models/message.dto';
import { IMessageRepository } from 'src/modules/messages/models/message.interface';
import { MessageModel } from 'src/modules/messages/models/message.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresMessageRepository implements IMessageRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async createMessage(
    data: Omit<
      IMessageCreateDTO,
      'actor_type' | 'actor_info_id' | 'entity_info'
    >
  ): Promise<MessageModel> {
    const message = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return message.dataValues;
  }
  async updateMessage(
    id: string,
    data: IMessageUpdateDTO
  ): Promise<MessageModel> {
    const message = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return message[1][0].dataValues;
  }
  async deleteMessage(id: string): Promise<boolean> {
    const message = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return message > 0;
  }
  async getMessageById(
    id: string,
    condition: IMessageConditionDTO
  ): Promise<MessageModel | null> {
    const message = await this.sequelize.models[this.modelName].findOne({
      where: { id },
    });
    return message?.dataValues;
  }
  async getMessageList(
    paging: PagingDTO,
    condition: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]> & { count_unread: number }> {
    const { page, limit } = paging;
    const where: any = {};
    if (condition.entity_id) where.entity_id = condition.entity_id;
    if (condition.actor_id) where.actor_id = condition.actor_id;
    if (condition.status) where.status = condition.status;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: ActorPersistence,
          as: actorModelName,
          attributes: ['id', 'type'],
        },
      ],
    });
    const count_unread = await this.sequelize.models[this.modelName].count({
      where: {
        read_at: null,
      },
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
        limit,
      },
      count_unread,
    };
  }
}

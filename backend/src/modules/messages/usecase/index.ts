import { ICustomerUseCase } from 'src/modules/customer/models/customer.interface';
import { IActorUseCase } from 'src/modules/messages/actor/models/actor.interface';
import { IEntityUseCase } from 'src/modules/messages/entity/models/entity.interface';
import {
  IMessageConditionDTO,
  IMessageCreateDTO,
  IMessageUpdateDTO,
} from 'src/modules/messages/models/message.dto';
import { MESSAGE_ENTITY_NOT_FOUND_ERROR } from 'src/modules/messages/models/message.error';
import {
  IMessageRepository,
  IMessageUseCase,
} from 'src/modules/messages/models/message.interface';
import { MessageModel } from 'src/modules/messages/models/message.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class MessageUsecase implements IMessageUseCase {
  constructor(
    private readonly messageRepo: IMessageRepository,
    private readonly actorUsecase: IActorUseCase,
    private readonly entityUsecase: IEntityUseCase,
    private readonly customerUsecase: ICustomerUseCase
  ) {}
  async getMessageById(
    id: string,
    condition: IMessageConditionDTO
  ): Promise<MessageModel | null> {
    return await this.messageRepo.getMessageById(id, condition);
  }
  async getMessageList(
    paging: PagingDTO,
    condition: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]> & { count_unread: number }> {
    return await this.messageRepo.getMessageList(paging, condition);
  }
  async createMessage(data: IMessageCreateDTO): Promise<MessageModel | null> {
    const { actor_type, actor_info_id, entity_info, ...rest } = data;
    const payload: Omit<
      IMessageCreateDTO,
      'actor_type' | 'actor_info_id' | 'entity_info'
    > = {
      ...rest,
    };
    let actor = await this.actorUsecase.getActorByActorInfoId(
      actor_info_id,
      {}
    );
    if (!actor) {
      actor = await this.actorUsecase.createActor({
        type: actor_type,
        actor_info_id: actor_info_id,
      });
      payload.actor_id = actor.id;
    } else {
      payload.actor_id = actor.id;
    }
    const entity = await this.entityUsecase.getEntityByTypeAndKind(
      entity_info.type,
      entity_info.kind
    );
    if (!entity) {
      return null;
    }
    payload.entity_id = entity.id;
    if (
      actor.type === 'customer' &&
      entity.type === 'order' &&
      entity.kind === 'create'
    ) {
      const customer = await this.customerUsecase.getCustomerById(
        actor.actor_info_id,
        {}
      );
      console.log("🚀 ~ MessageUsecase ~ createMessage ~ customer:", customer)
      const template = entity.template;
      payload.message = `${template
        .replace('{{kind}}', entity.kind.toLowerCase())
        .replace(
          '{{actor_id}}',
          `${customer?.first_name || ''} ${customer?.last_name || ''}`
        )} at ${new Date().toLocaleString()}`;
    }
    return await this.messageRepo.createMessage(payload);
  }

  async updateMessage(
    id: string,
    data: IMessageUpdateDTO
  ): Promise<MessageModel> {
    return await this.messageRepo.updateMessage(id, data);
  }
  async deleteMessage(id: string): Promise<boolean> {
    return await this.messageRepo.deleteMessage(id);
  }
}

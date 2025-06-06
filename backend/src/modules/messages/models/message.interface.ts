import {
  IMessageCreateDTO,
  IMessageUpdateDTO,
} from 'src/modules/messages/models/message.dto';
import { IMessageConditionDTO } from 'src/modules/messages/models/message.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { MessageModel } from 'src/modules/messages/models/message.model';
import { Transaction } from 'sequelize';

export interface IMessageUseCase {
  getMessageById(
    id: string,
    condition?: IMessageConditionDTO
  ): Promise<MessageModel | null>;
  getMessageList(
    paging: PagingDTO,
    condition?: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]> & { count_unread: number }>;
  createMessage(
    data: Omit<IMessageCreateDTO, 'entity_id' | 'actor_id' | 'message'>,
    t?: Transaction
  ): Promise<MessageModel | null>;
  updateMessage(id: string, data: IMessageUpdateDTO): Promise<MessageModel>;
  deleteMessage(id: string): Promise<boolean>;
}

export interface IMessageRepository
  extends ICommandRepository,
    IQueryRepository {}

export interface IQueryRepository {
  getMessageById(
    id: string,
    condition: IMessageConditionDTO
  ): Promise<MessageModel | null>;
  getMessageList(
    paging: PagingDTO,
    condition: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]> & { count_unread: number }>;
}

export interface ICommandRepository {
  createMessage(
    data: Omit<
      IMessageCreateDTO,
      'actor_type' | 'actor_info_id' | 'entity_info'
    >,
    t?: Transaction
  ): Promise<MessageModel>;
  updateMessage(id: string, data: IMessageUpdateDTO): Promise<MessageModel>;
  deleteMessage(id: string): Promise<boolean>;
}

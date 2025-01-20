import {
  IMessageCreateDTO,
  IMessageUpdateDTO,
} from 'src/modules/messages/models/message.dto';
import { IMessageConditionDTO } from 'src/modules/messages/models/message.dto';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { MessageModel } from 'src/modules/messages/models/message.model';

export interface IMessageUseCase {
  getMessageById(
    id: string,
    condition?: IMessageConditionDTO
  ): Promise<MessageModel | null>;
  getMessageList(
    paging: PagingDTO,
    condition?: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]>>;
  createMessage(data: IMessageCreateDTO): Promise<MessageModel>;
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
  ): Promise<ListResponse<MessageModel[]>>;
}

export interface ICommandRepository {
  createMessage(data: IMessageCreateDTO): Promise<MessageModel>;
  updateMessage(id: string, data: IMessageUpdateDTO): Promise<MessageModel>;
  deleteMessage(id: string): Promise<boolean>;
}

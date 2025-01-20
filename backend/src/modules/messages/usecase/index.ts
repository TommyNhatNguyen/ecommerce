import {
  IMessageConditionDTO,
  IMessageCreateDTO,
  IMessageUpdateDTO,
} from 'src/modules/messages/models/message.dto';
import {
  IMessageRepository,
  IMessageUseCase,
} from 'src/modules/messages/models/message.interface';
import { MessageModel } from 'src/modules/messages/models/message.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class MessageUsecase implements IMessageUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}
  async getMessageById(
    id: string,
    condition: IMessageConditionDTO
  ): Promise<MessageModel | null> {
    return await this.messageRepo.getMessageById(id, condition);
  }
  async getMessageList(
    paging: PagingDTO,
    condition: IMessageConditionDTO
  ): Promise<ListResponse<MessageModel[]>> {
    return await this.messageRepo.getMessageList(paging, condition);
  }
  async createMessage(data: IMessageCreateDTO): Promise<MessageModel> {
    return await this.messageRepo.createMessage(data);
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

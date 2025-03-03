import {
  CreateConversationDTO,
  CreateMessageDTO,
  MessageConditionDTO,
  UpdateMessageDTO,
} from 'src/modules/chat/models/chat.dto';
import { IMessage } from 'src/modules/chat/models/chat.models';
import {
  ConversationRepository,
  IConversationUseCase,
  IMessageUseCase,
  MessageRepository,
} from 'src/modules/chat/models/chat.interface';
import { PagingDTO } from 'src/share/models/paging';
import { ListResponse } from 'src/share/models/base-model';
import { IConversation } from 'src/modules/chat/models/chat.models';
import {
  ConversationConditionDTO,
  UpdateConversationDTO,
} from 'src/modules/chat/models/chat.dto';
import { ObjectId } from 'mongoose';
import { CONVERSATION_NOT_FOUND } from 'src/modules/chat/models/chat.errors';
import { v7 as uuidv7 } from 'uuid';

export class ConversationUseCase implements IConversationUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageUseCase: MessageUseCase
  ) {}
  async createConversation(
    data: CreateConversationDTO
  ): Promise<IConversation> {
    const payload: CreateConversationDTO = {
      ...data,
      room: data?.room || uuidv7(),
    };
    return this.conversationRepository.createConversation(payload);
  }

  async getConversationList(
    paging: PagingDTO,
    condition?: ConversationConditionDTO
  ): Promise<ListResponse<IConversation[]>> {
    return this.conversationRepository.getConversationList(paging, condition);
  }

  async getConversation(
    id: string,
    condition?: ConversationConditionDTO
  ): Promise<IConversation | null> {
    return this.conversationRepository.getConversation(id, condition);
  }

  async getConversationByUserId(userId: string): Promise<IConversation | null> {
    return this.conversationRepository.getConversationByUserId(userId);
  }

  async getAllConversation(
    condition?: ConversationConditionDTO
  ): Promise<ListResponse<IConversation[]>> {
    return this.conversationRepository.getAllConversation(condition);
  }

  async updateConversation(
    id: string,
    data: UpdateConversationDTO
  ): Promise<IConversation> {
    return this.conversationRepository.updateConversation(id, data);
  }

  async deleteConversation(id: string): Promise<IConversation> {
    return this.conversationRepository.deleteConversation(id);
  }

  async addMessageToConversation(
    conversationId: string,
    message: ObjectId
  ): Promise<IConversation> {
    return this.conversationRepository.addMessageToConversation(
      conversationId,
      message
    );
  }
  async createMessageWithConversationId(
    conversationId: string,
    data: CreateMessageDTO
  ): Promise<IMessage> {
    // Check if the conversation exists
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      throw CONVERSATION_NOT_FOUND;
    }
    // Create new message
    const message = await this.messageUseCase.createMessage(data);
    // Add message to conversation
    await this.addMessageToConversation(conversationId, message.toObject());
    // Return the new message
    return message;
  }
}
export class MessageUseCase implements IMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(data: CreateMessageDTO): Promise<IMessage> {
    return this.messageRepository.createMessage(data);
  }

  async getMessageList(
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ): Promise<ListResponse<IMessage[]>> {
    return this.messageRepository.getMessageList(paging, condition);
  }

  async getMessage(
    id: string,
    condition?: MessageConditionDTO
  ): Promise<IMessage> {
    return this.messageRepository.getMessage(id, condition);
  }

  async getAllMessage(
    condition?: MessageConditionDTO
  ): Promise<ListResponse<IMessage[]>> {
    return this.messageRepository.getAllMessage(condition);
  }

  async updateMessage(id: string, data: UpdateMessageDTO): Promise<IMessage> {
    return this.messageRepository.updateMessage(id, data);
  }

  async deleteMessage(id: string): Promise<IMessage> {
    return this.messageRepository.deleteMessage(id);
  }
}

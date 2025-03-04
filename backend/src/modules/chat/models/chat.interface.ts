import { IConversation, IMessage } from 'src/modules/chat/models/chat.models';

import {
  ConversationConditionDTO,
  CreateConversationDTO,
  CreateMessageDTO,
  MessageConditionDTO,
  UpdateConversationDTO,
  UpdateMessageDTO,
} from 'src/modules/chat/models/chat.dto';
import { PagingDTO } from 'src/share/models/paging';
import { ListResponse } from 'src/share/models/base-model';
import { ObjectId } from 'mongoose';

export interface IConversationUseCase {
  createConversation: (data: CreateConversationDTO) => Promise<IConversation>;
  getConversationList: (
    paging: PagingDTO,
    condition?: ConversationConditionDTO
  ) => Promise<ListResponse<IConversation[]>>;
  getConversation: (
    id: string,
    condition?: ConversationConditionDTO
  ) => Promise<IConversation | null>;
  getAllConversation: (
    condition?: ConversationConditionDTO
  ) => Promise<ListResponse<IConversation[]>>;
  updateConversation: (
    id: string,
    data: UpdateConversationDTO
  ) => Promise<IConversation>;
  getConversationByUserId: (userId: string) => Promise<IConversation | null>;
  getMessageListByConversationId: (
    conversationId: string,
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  deleteConversation: (id: string) => Promise<IConversation>;
  createMessageWithConversationId: (
    conversationId: string,
    data: CreateMessageDTO
  ) => Promise<IMessage>;
  addMessageToConversation: (
    conversationId: string,
    message: ObjectId
  ) => Promise<IConversation>;
}

export interface IMessageUseCase {
  createMessage: (data: CreateMessageDTO) => Promise<IMessage>;
  getMessageList: (
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  getMessage: (
    id: string,
    condition?: MessageConditionDTO
  ) => Promise<IMessage>;
  getAllMessage: (
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  updateMessage: (id: string, data: UpdateMessageDTO) => Promise<IMessage>;
  deleteMessage: (id: string) => Promise<IMessage>;
}

export interface ConversationRepository {
  getConversationList: (
    paging: PagingDTO,
    condition?: ConversationConditionDTO
  ) => Promise<ListResponse<IConversation[]>>;
  getConversationByUserId: (userId: string) => Promise<IConversation | null>;
  getMessageListByConversationId: (
    conversationId: string,
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  getConversation: (
    id: string,
    condition?: ConversationConditionDTO
  ) => Promise<IConversation | null>;
  getAllConversation: (
    condition?: ConversationConditionDTO
  ) => Promise<ListResponse<IConversation[]>>;
  createConversation: (data: CreateConversationDTO) => Promise<IConversation>;
  updateConversation: (
    id: string,
    data: UpdateConversationDTO
  ) => Promise<IConversation>;
  deleteConversation: (id: string) => Promise<IConversation>;
  addMessageToConversation: (
    conversationId: string,
    message: ObjectId
  ) => Promise<IConversation>;
}

export interface MessageRepository {
  getMessageList: (
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  createMessage: (data: CreateMessageDTO) => Promise<IMessage>;
  updateMessage: (id: string, data: UpdateMessageDTO) => Promise<IMessage>;
  getAllMessage: (
    condition?: MessageConditionDTO
  ) => Promise<ListResponse<IMessage[]>>;
  getMessage: (
    id: string,
    condition?: MessageConditionDTO
  ) => Promise<IMessage>;
  deleteMessage: (id: string) => Promise<IMessage>;
}

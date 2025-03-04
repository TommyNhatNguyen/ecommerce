import { Model, ObjectId } from 'mongoose';
import {
  CreateConversationDTO,
  UpdateConversationDTO,
  CreateMessageDTO,
  UpdateMessageDTO,
  MessageConditionDTO,
} from 'src/modules/chat/models/chat.dto';
import { ConversationConditionDTO } from 'src/modules/chat/models/chat.dto';
import {
  CONVERSATION_NOT_FOUND,
  MESSAGE_NOT_FOUND,
} from 'src/modules/chat/models/chat.errors';
import {
  ConversationRepository,
  MessageRepository,
} from 'src/modules/chat/models/chat.interface';
import { IConversation, IMessage } from 'src/modules/chat/models/chat.models';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { messageModelName } from 'src/modules/chat/infras/repo/chat-dto';

export class ConversationRepo implements ConversationRepository {
  constructor(private readonly conversationModel: Model<IConversation>) {}
  async getConversationByUserId(userId: string): Promise<IConversation | null> {
    const conversation = await this.conversationModel.findOne({
      sender: userId,
    });
    return conversation || null;
  }
  async getConversationByUserIdAndRoomId(
    userId: string,
    roomId: string
  ): Promise<IConversation | null> {
    const conversation = await this.conversationModel.findOne({
      $and: [{ sender: userId }, { room: roomId }],
    });
    return conversation || null;
  }

  async getConversationList(
    paging: PagingDTO,
    condition?: ConversationConditionDTO
  ): Promise<ListResponse<IConversation[]>> {
    const query = this.conversationModel
      .find({
        ...condition,
      })
      .populate('messages')
      .populate('latestMessage');
    const total = await this.conversationModel.countDocuments(condition);
    const data = await query
      .skip((paging.page - 1) * paging.limit)
      .limit(paging.limit)
      .exec();
    return {
      data,
      meta: {
        total_count: total,
        current_page: paging.page,
        limit: paging.limit,
        total_page: Math.ceil(total / paging.limit),
      },
    };
  }
  async getConversation(
    id: string,
    condition?: ConversationConditionDTO
  ): Promise<IConversation | null> {
    const query = this.conversationModel
      .findById(id, {
        ...condition,
      })
      .populate(`${messageModelName}s`.toLowerCase());
    console.log('🚀 ~ ConversationRepo ~ query:', query);
    const data = await query.exec();
    console.log('🚀 ~ ConversationRepo ~ data:', data);
    return data || null;
  }
  async getAllConversation(
    condition?: ConversationConditionDTO
  ): Promise<ListResponse<IConversation[]>> {
    const query = this.conversationModel
      .find({
        ...condition,
      })
      .populate(`${messageModelName}s`.toLowerCase());
    const total = await this.conversationModel.countDocuments(condition);
    const data = await query.exec();
    return {
      data,
      meta: {
        total_count: total,
        current_page: 1,
        limit: total,
        total_page: 1,
      },
    };
  }
  async createConversation(
    data: CreateConversationDTO
  ): Promise<IConversation> {
    const conversation = await this.conversationModel.create(data);
    return conversation;
  }
  async updateConversation(
    id: string,
    data: UpdateConversationDTO
  ): Promise<IConversation> {
    const conversation = await this.conversationModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
    if (!conversation) {
      throw CONVERSATION_NOT_FOUND;
    }
    return conversation;
  }
  async deleteConversation(id: string): Promise<IConversation> {
    const conversation = await this.conversationModel.findByIdAndDelete(id);
    if (!conversation) {
      throw CONVERSATION_NOT_FOUND;
    }
    return conversation;
  }
  async addMessageToConversation(
    conversationId: string,
    message: ObjectId
  ): Promise<IConversation> {
    const conversation = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      { $push: { messages: message } },
      { new: true }
    );
    if (!conversation) {
      throw CONVERSATION_NOT_FOUND;
    }
    conversation.latestMessage = message;
    await conversation.save();
    return conversation;
  }

  async getMessageListByConversationId(
    conversationId: string,
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ): Promise<ListResponse<IMessage[]>> {
    const page = Number(paging.page) || 1;
    const limit = Number(paging.limit) || 10;
    const skip = (page - 1) * limit;
    const data = await this.conversationModel
      .findById(conversationId)
      .populate({
        path: 'messages',
        match: condition,
        options: {
          skip,
          limit,
          sort: {
            createdAt: -1,
          },
        },
      }).lean()
      .exec();
    const total = await this.conversationModel.countDocuments(condition);
    const messages = data?.messages || [];
    return {
      data: messages as unknown as IMessage[],
      meta: {
        total_count: total,
        current_page: paging.page,
        limit: paging.limit,
        total_page: Math.ceil(total / paging.limit),
      },
    };
  }
}

export class MessageRepo implements MessageRepository {
  constructor(private readonly messageModel: Model<IMessage>) {}
  async getMessageList(
    paging: PagingDTO,
    condition?: MessageConditionDTO
  ): Promise<ListResponse<IMessage[]>> {
    const query = this.messageModel.find({
      ...condition,
    });
    const total = await this.messageModel.countDocuments(condition);
    const data = await query
      .skip((paging.page - 1) * paging.limit)
      .limit(paging.limit)
      .exec();
    return {
      data,
      meta: {
        total_count: total,
        current_page: paging.page,
        limit: paging.limit,
        total_page: Math.ceil(total / paging.limit),
      },
    };
  }
  async getMessage(
    id: string,
    condition?: MessageConditionDTO
  ): Promise<IMessage> {
    const query = this.messageModel.findById(id, {
      ...condition,
    });
    const data = await query.exec();
    if (!data) {
      throw MESSAGE_NOT_FOUND;
    }
    return data;
  }
  async getAllMessage(
    condition?: MessageConditionDTO
  ): Promise<ListResponse<IMessage[]>> {
    const query = this.messageModel.find({
      ...condition,
    });
    const total = await this.messageModel.countDocuments(condition);
    const data = await query.exec();
    return {
      data,
      meta: {
        total_count: total,
        current_page: 1,
        limit: total,
        total_page: 1,
      },
    };
  }
  async createMessage(data: CreateMessageDTO): Promise<IMessage> {
    const message = await this.messageModel.create(data);
    return message;
  }
  async updateMessage(id: string, data: UpdateMessageDTO): Promise<IMessage> {
    const message = await this.messageModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!message) {
      throw MESSAGE_NOT_FOUND;
    }
    return message;
  }
  async deleteMessage(id: string): Promise<IMessage> {
    const message = await this.messageModel.findByIdAndDelete(id);
    if (!message) {
      throw MESSAGE_NOT_FOUND;
    }
    return message;
  }
}

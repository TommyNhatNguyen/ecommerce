import {
  ConversationConditionDTO,
  ConversationConditionDTOSchema,
  CreateConversationDTOSchema,
  CreateMessageDTO,
  CreateMessageDTOSchema,
  MessageConditionDTO,
  MessageConditionDTOSchema,
  UpdateConversationDTO,
  UpdateConversationDTOSchema,
  UpdateMessageDTO,
  UpdateMessageDTOSchema,
} from 'src/modules/chat/models/chat.dto';
import { CreateConversationDTO } from 'src/modules/chat/models/chat.dto';
import { PagingDTO, PagingDTOSchema } from 'src/share/models/paging';
import {
  IConversationUseCase,
  IMessageUseCase,
} from 'src/modules/chat/models/chat.interface';
import { IConversation, IMessage } from 'src/modules/chat/models/chat.models';
import { ListResponse } from 'src/share/models/base-model';
import { Request, Response } from 'express';

export class ChatHttpService {
  constructor(
    private readonly conversationUseCase: IConversationUseCase,
    private readonly messageUseCase: IMessageUseCase
  ) {}

  async getMessageListByConversationId(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = MessageConditionDTOSchema.safeParse(
      req.query
    );
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success || !pagingSuccess) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageList =
        await this.conversationUseCase.getMessageListByConversationId(
          id,
          pagingData,
          data
        );
      res.status(200).json({
        message: 'Get message list successfully',
        success: true,
        ...messageList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async createMessageWithConversationId(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CreateMessageDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageResponseData =
        await this.conversationUseCase.createMessageWithConversationId(
          id,
          data
        );
      res.status(200).json({
        message: 'Create message successfully',
        success: true,
        messageResponseData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async createConversation(req: Request, res: Response) {
    const { success, data, error } = CreateConversationDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const conversation = await this.conversationUseCase.createConversation(
        data
      );
      res.status(200).json({
        message: 'Create conversation successfully',
        success: true,
        conversation,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getConversationList(req: Request, res: Response) {
    const { success, data, error } = ConversationConditionDTOSchema.safeParse(
      req.query
    );
    
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    if (!pagingSuccess) {
      res.status(400).json({ success: false, message: pagingError?.message });
      return;
    }
    console.log('🚀 ~ ChatHttpService ~ getConversationList ~ data:', req.query, req.params, data, pagingData);
    try {
      const conversationList =
        await this.conversationUseCase.getConversationList(pagingData, data);
      res.status(200).json({
        message: 'Get conversation list successfully',
        success: true,
        ...conversationList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getConversationById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = ConversationConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const conversation = await this.conversationUseCase.getConversation(
        id,
        data
      );
      res.status(200).json({
        message: 'Get conversation successfully',
        success: true,
        conversation,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getAllConversation(req: Request, res: Response) {
    const { success, data, error } = ConversationConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const conversationList =
        await this.conversationUseCase.getAllConversation(data);
      res.status(200).json({
        message: 'Get all conversation successfully',
        success: true,
        conversationList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async updateConversation(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = UpdateConversationDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const conversation = await this.conversationUseCase.updateConversation(
        id,
        data
      );
      res.status(200).json({
        message: 'Update conversation successfully',
        success: true,
        conversation,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteConversation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const conversation = await this.conversationUseCase.deleteConversation(
        id
      );
      res.status(200).json({
        message: 'Delete conversation successfully',
        success: true,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async createMessage(req: Request, res: Response) {
    const { success, data, error } = CreateMessageDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageResponseData = await this.messageUseCase.createMessage(data);
      res.status(200).json({
        message: 'Create message successfully',
        success: true,
        messageResponseData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getMessageList(req: Request, res: Response) {
    const { success, data, error } = MessageConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    if (!pagingSuccess) {
      res.status(400).json({ success: false, message: pagingError?.message });
      return;
    }
    try {
      const messageList = await this.messageUseCase.getMessageList(
        pagingData,
        data
      );
      res.status(200).json({
        message: 'Get message list successfully',
        success: true,
        messageList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getMessageById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = MessageConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageResponseData = await this.messageUseCase.getMessage(
        id,
        data
      );
      res.status(200).json({
        message: 'Get message successfully',
        success: true,
        messageResponseData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async getAllMessage(req: Request, res: Response) {
    const { success, data, error } = MessageConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageList = await this.messageUseCase.getAllMessage(data);
      res.status(200).json({
        message: 'Get all message successfully',
        success: true,
        messageList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async updateMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = UpdateMessageDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error?.message });
      return;
    }
    try {
      const messageResponseData = await this.messageUseCase.updateMessage(
        id,
        data
      );
      res.status(200).json({
        message: 'Update message successfully',
        success: true,
        messageResponseData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const messageResponseData = await this.messageUseCase.deleteMessage(id);
      res.status(200).json({
        message: 'Delete message successfully',
        success: true,
        messageResponseData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}

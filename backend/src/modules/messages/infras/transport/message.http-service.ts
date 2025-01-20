import { Request, Response } from 'express';
import {
  IMessageConditionDTOSchema,
  IMessageCreateDTOSchema,
  IMessageUpdateDTOSchema,
} from 'src/modules/messages/models/message.dto';
import { IMessageUseCase } from 'src/modules/messages/models/message.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class MessageHttpService {
  constructor(private readonly messageUseCase: IMessageUseCase) {}
  async getMessageById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IMessageConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const message = await this.messageUseCase.getMessageById(id, data);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getMessageList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = IMessageConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res
        .status(400)
        .json({ message: errorPaging?.message || errorCondition?.message });
      return;
    }
    try {
      const messageList = await this.messageUseCase.getMessageList(
        paging,
        condition
      );
      if (!messageList) {
        res.status(404).json({ message: 'Message list not found' });
        return;
      }
      res.status(200).json(messageList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createMessage(req: Request, res: Response) {
    const { success, data, error } = IMessageCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const message = await this.messageUseCase.createMessage(data);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateMessage(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IMessageUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const message = await this.messageUseCase.getMessageById(id);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }
      const updatedMessage = await this.messageUseCase.updateMessage(id, data);
      if (!updatedMessage) {
        res.status(404).json({ message: 'Failed to update message' });
        return;
      }
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteMessage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const message = await this.messageUseCase.getMessageById(id);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }
      const deletedMessage = await this.messageUseCase.deleteMessage(id);
      if (!deletedMessage) {
        res.status(404).json({ message: 'Failed to delete message' });
        return;
      }
      res.status(200).json(deletedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}

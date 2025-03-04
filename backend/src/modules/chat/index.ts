import { MessageUseCase } from 'src/modules/chat/usecase/chat-usecase';
import { ConversationUseCase } from 'src/modules/chat/usecase/chat-usecase';
import { ConversationRepo, MessageRepo } from './infras/repo/chat-repo';
import {
  ConversationModel,
  MessageModel,
} from 'src/modules/chat/infras/repo/chat-dto';
import { ChatHttpService } from 'src/modules/chat/infras/transport/chat.http-service';
import { Router } from 'express';

export const setupChat = () => {
  const conversationRepo = new ConversationRepo(
    ConversationModel,
    MessageModel
  );
  const messageRepo = new MessageRepo(MessageModel);
  const messageUseCase = new MessageUseCase(messageRepo);
  const conversationUseCase = new ConversationUseCase(
    conversationRepo,
    messageUseCase
  );
  const chatHttpService = new ChatHttpService(
    conversationUseCase,
    messageUseCase
  );
  const router = Router();
  router.get(
    '/conversation/:id/message',
    chatHttpService.getMessageListByConversationId.bind(chatHttpService)
  );
  router.post(
    '/conversation',
    chatHttpService.createConversation.bind(chatHttpService)
  );
  router.get(
    '/conversation',
    chatHttpService.getConversationList.bind(chatHttpService)
  );
  router.get(
    '/conversation/:id',
    chatHttpService.getConversationById.bind(chatHttpService)
  );
  router.put(
    '/conversation/:id',
    chatHttpService.updateConversation.bind(chatHttpService)
  );
  router.delete(
    '/conversation/:id',
    chatHttpService.deleteConversation.bind(chatHttpService)
  );
  router.post(
    '/chat-message',
    chatHttpService.createMessage.bind(chatHttpService)
  );
  router.get(
    '/chat-message',
    chatHttpService.getMessageList.bind(chatHttpService)
  );
  router.get(
    '/chat-message/:id',
    chatHttpService.getMessageById.bind(chatHttpService)
  );
  router.put(
    '/chat-message/:id',
    chatHttpService.updateMessage.bind(chatHttpService)
  );
  router.delete(
    '/chat-message/:id',
    chatHttpService.deleteMessage.bind(chatHttpService)
  );
  router.post(
    '/chat-message/conversation/:id',
    chatHttpService.createMessageWithConversationId.bind(chatHttpService)
  );
  return router;
};

import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';

import Websocket from 'src/socket/infras/repo';
import { SocketUseCase } from 'src/socket/usecase';
import { SocketIoAdapter } from 'src/socket/infras/transport';
import Consumer from 'src/brokers/infras/consumer';
import { QueueTypes } from 'src/brokers/transport/queueTypes';
import { ConversationUseCase } from 'src/modules/chat/usecase/chat-usecase';
import { MessageRepo } from 'src/modules/chat/infras/repo/chat-repo';
import { MessageModel } from 'src/modules/chat/infras/repo/chat-dto';
import { ConversationRepo } from 'src/modules/chat/infras/repo/chat-repo';
import { ConversationModel } from 'src/modules/chat/infras/repo/chat-dto';
import { MessageUseCase } from 'src/modules/chat/usecase/chat-usecase';

export const orderNameSpaceSocketSetup = (io: Websocket): SocketUseCase => {
  // Order namespace
  const orderIo = io.of(SOCKET_NAMESPACE.ORDER.namespace);
  const socketIoAdapter = new SocketIoAdapter(orderIo);
  const orderSocketUseCase = new SocketUseCase(socketIoAdapter);
  orderIo.on('connection', (socket) => {
    console.log(
      'Admin connected:',
      socket.id,
      io.engine.clientsCount,
      socket.connected
    );
    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id, io.engine.clientsCount);
    });
  });
  return orderSocketUseCase;
};

export const inventoryNameSpaceSocketSetup = (io: Websocket): SocketUseCase => {
  // Inventory namespace
  const inventoryIo = io.of(SOCKET_NAMESPACE.INVENTORY.namespace);
  const inventorySocketIoAdapter = new SocketIoAdapter(inventoryIo);
  const inventorySocketUseCase = new SocketUseCase(inventorySocketIoAdapter);
  inventoryIo.on('connection', (socket) => {
    console.log('Inventory connected:', socket.id, io.engine.clientsCount);

    socket.on('disconnect', () => {
      console.log('Inventory disconnected:', socket.id, io.engine.clientsCount);
    });
  });
  return inventorySocketUseCase;
};
type ChatSocketData = {
  message: string;
  user_id: string;
};
export const chatNameSpaceSocketSetup = (io: Websocket): SocketUseCase => {
  const conversationRepo = new ConversationRepo(ConversationModel);
  const messageRepo = new MessageRepo(MessageModel);
  const messageUseCase = new MessageUseCase(messageRepo);
  const conversationUseCase = new ConversationUseCase(
    conversationRepo,
    messageUseCase
  );
  // Chat namespace
  let currentRoomId = '';
  let currentConversationId = '';
  const chatIo = io.of(SOCKET_NAMESPACE.CHAT.namespace);
  const chatSocketIoAdapter = new SocketIoAdapter(chatIo);
  const chatSocketUseCase = new SocketUseCase(chatSocketIoAdapter);
  chatIo.on('connection', (socket) => {
    // Add user to room and emit message
    socket.on(
      SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE,
      async (data: ChatSocketData) => {
        // Find conversation id based on socket query user id
        const conversation = await conversationUseCase.getConversationByUserId(
          data.user_id
        );
        if (!conversation) {
          const newConversation = await conversationUseCase.createConversation({
            sender: data.user_id,
          });
          currentRoomId = newConversation.room;
          currentConversationId = newConversation._id as string;
        } else {
          currentRoomId = conversation.room;
          currentConversationId = conversation._id as string;
        }
        // Join room
        socket.join(currentRoomId);
        // Create message
        const newMessage =
          await conversationUseCase.createMessageWithConversationId(
            currentConversationId,
            {
              content: data.message,
              sender: data.user_id,
              participants: [data.user_id],
            }
          );
        // Send message to room
        socket
          .to(currentRoomId)
          .emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE, {
            message: data.message,
            user_id: data.user_id,
          });
        // Notify to admin to refetch conversation list
        chatIo.emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_ADMIN_NOTIFY, JSON.stringify({
          message: newMessage.content,
          user_id: data.user_id,
        }));
      }
    );
    // Add admin to all conversation
  });
  return chatSocketUseCase;
};

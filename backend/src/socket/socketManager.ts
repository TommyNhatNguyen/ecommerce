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
import { Sequelize } from 'sequelize';
import { PostgresActorRepository } from 'src/modules/messages/actor/infras/postgres/repo';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { MessageUsecase } from 'src/modules/messages/usecase';
import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { messageModelName } from 'src/modules/messages/infras/repo/postgres/dto';
import { v7 } from 'uuid';

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
type ChatAdminSocketData = {
  message: string;
  user_id: string;
  conversation_id: string;
  room_id: string;
};
export const chatNameSpaceSocketSetup = (
  io: Websocket,
  sequelize: Sequelize
): SocketUseCase => {
  const conversationRepo = new ConversationRepo(ConversationModel);
  const messageRepo = new MessageRepo(MessageModel);
  const messageUseCase = new MessageUseCase(messageRepo);
  const conversationUseCase = new ConversationUseCase(
    conversationRepo,
    messageUseCase
  );
  const messageRepository = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );
  const actorRepository = new PostgresActorRepository(
    sequelize,
    actorModelName
  );
  const entityRepository = new PostgresEntityRepository(
    sequelize,
    entityModelName
  );
  const customerRepository = new PostgresCustomerRepository(
    sequelize,
    customerModelName
  );
  const customerUseCase = new CustomerUseCase(customerRepository);
  const messageNotificationUseCase = new MessageUsecase(
    messageRepository,
    actorRepository,
    entityRepository,
    customerUseCase
  );
  // Chat namespace
  let currentRoomId = '';
  let currentConversationId = '';
  let customerId = '';
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
        // Check if customer exist in conversation
        const customer = await customerUseCase.getCustomerById(
          data.user_id,
          {}
        );
        customerId = customer ? customer.id : v7();
        console.log('🚀 ~ customer:', customer, data.user_id);
        if (!conversation) {
          const newConversation = await conversationUseCase.createConversation({
            sender: customerId,
            createdAt: new Date(),
          });
          customerId = newConversation.sender;
          console.log('🚀 ~ newConversation:', newConversation);
          currentRoomId = newConversation.room;
          currentConversationId = newConversation._id as string;
        } else {
          currentRoomId = conversation.room;
          currentConversationId = conversation._id as string;
        }
        console.log('🚀 ~ conversation:', currentConversationId);
        console.log('🚀 ~ customer:', currentRoomId);
        // Join room
        socket.join(currentRoomId);
        // Create message
        const newMessage =
          await conversationUseCase.createMessageWithConversationId(
            currentConversationId,
            {
              content: data.message,
              sender: customerId,
              participants: [customerId],
            }
          );
        console.log('🚀 ~ newMessage:', newMessage);
        // Update conversation
        await conversationUseCase.updateConversation(currentConversationId, {
          latestMessage: newMessage,
          latestMessageCreatedAt: new Date(),
          createdAt: new Date(),
        });
        // Send message to room
        socket
          .to(currentRoomId)
          .emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE, {
            message: data.message,
            user_id: customerId,
          });
        // Notify to admin to refetch conversation list
        chatIo.emit(
          SOCKET_NAMESPACE.CHAT.endpoints.CHAT_ADMIN_NOTIFY,
          JSON.stringify({
            message: newMessage.content,
            user_id: customerId,
          })
        );
        const message = await messageNotificationUseCase.createMessage({
          entity_info: {
            type: 'chat',
            kind: EntityKind.NOTIFICATION,
          },
          actor_info_id: customerId,
          actor_type: ActorType.CUSTOMER,
          message: `A new message from ${
            newMessage.sender
          } at: ${new Date().toLocaleString()}`,
        });
        console.log('🚀 ~ message:', message);
      }
    );
    // Add admin to all conversation
    socket.on(
      SOCKET_NAMESPACE.CHAT.endpoints.CHAT_ADMIN_MESSAGE,
      async (data: ChatAdminSocketData) => {
        console.log('🚀 ~ data:', data);
        // Join room 
        if (data.message === 'join-room') {
          socket.join(data.room_id);
          socket
            .to(data.room_id)
            .emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE, {
              message: `Admin ${data.user_id} joined the room`,
              user_id: data.user_id,
            });
          return;
        }
        if (data.message === 'leave-room') {
          socket.leave(data.room_id);
          socket
            .to(data.room_id)
            .emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE, {
              message: `Admin ${data.user_id} left the room`,
              user_id: data.user_id,
            });
          return;
        }
        // Create message
        const newMessage =
          await conversationUseCase.createMessageWithConversationId(
            data.conversation_id,
            {
              content: data.message,
              sender: data.user_id,
              participants: [data.user_id],
            }
          );
        // Send message to room
        socket
          .to(data.room_id)
          .emit(SOCKET_NAMESPACE.CHAT.endpoints.CHAT_MESSAGE, {
            message: newMessage.content,
            user_id: data.user_id,
          });
        // Update conversation
        await conversationUseCase.updateConversation(data.conversation_id, {
          latestMessage: newMessage,
          latestMessageCreatedAt: new Date(),
          createdAt: new Date(),
        });
      }
    );
  });
  return chatSocketUseCase;
};

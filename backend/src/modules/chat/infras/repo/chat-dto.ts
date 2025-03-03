import {
  ConversationSchema,
  IConversation,
  IMessage,
  MessageSchema,
} from 'src/modules/chat/models/chat.models';
import { model } from 'mongoose';

export const conversationModelName = 'Conversation';
export const ConversationModel = model<IConversation>(
  conversationModelName,
  ConversationSchema
);

export const messageModelName = 'Message';
export const MessageModel = model<IMessage>(messageModelName, MessageSchema);

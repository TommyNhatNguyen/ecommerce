import { Document, model, ObjectId, Schema } from 'mongoose';

export interface IConversation extends Document {
  sender: string;
  room: string;
  messages: ObjectId[];
  latestMessage: ObjectId;
  latestMessageCreatedAt: Date;
  createdAt: Date;
}

export interface IMessage extends Document {
  sender: string;
  participants: string[];
  content: string;
  createdAt: Date;
  conversation: ObjectId;
}

export const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
});

export const ConversationSchema = new Schema<IConversation>({
  sender: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  messages: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  latestMessageCreatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

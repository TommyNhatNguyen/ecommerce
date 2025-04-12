export interface IConversation {
  _id: string;
  sender: string;
  room: string;
  messages: IMessage[];
  latestMessage: IMessage;
  latestMessageCreatedAt: string;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  sender: string;
  participants: string[];
  content: string;
  createdAt: string;
}

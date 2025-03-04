export interface ICreateConversationDTO {
  sender: string;
  room?: string;
}

export interface ICreateMessageDTO {
  sender: string;
  participants?: string[];
  content: string;
}

export interface IUpdateMessageDTO {
  sender?: string;
  content?: string;
  participants?: string[];
}

export interface IUpdateConversationDTO {
  sender?: string;
  room?: string;
  latestMessage?: string;
  createdAt?: Date;
}

export interface IConversationConditionDTO {
  sender?: string;
  room?: string;
  latestMessage?: string;
  createdAt?: Date;
  limit?: number;
  page?: number;
}

export interface IMessageConditionDTO {
  sender?: string;
  content?: string;
  participants?: string[];
  createdAt?: Date;
  limit?: number;
  page?: number;
}
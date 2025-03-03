export interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
}

export interface GroupedMessages {
  [date: string]: Message[];
}

export interface MessageListProps {
  messages: Message[];
}

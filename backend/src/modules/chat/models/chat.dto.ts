import z from 'zod';

export const CreateConversationDTOSchema = z.object({
  // Create when user click on chat button
  sender: z.any(),
  // Auto generate when user click on chat button
  room: z.string().optional(),
  latestMessage: z.any().optional(),
  latestMessageCreatedAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const CreateMessageDTOSchema = z.object({
  // Create when user chat
  sender: z.any(),
  // Create when user chat
  participants: z.array(z.string()).optional(),
  // Create when user chat
  content: z.string(),
  // Create when user chat
  conversation: z.any(),
});

export const UpdateMessageDTOSchema = z.object({
  // Update when user chat
  sender: z.any().optional(),
  // Update when user chat
  content: z.string().optional(),
  // Update when user chat
  participants: z.array(z.string()).optional(),
  // Update when user chat
  conversation: z.any().optional(),
});

export const UpdateConversationDTOSchema = z.object({
  // Update when user chat
  sender: z.any().optional(),
  // Update when user chat
  room: z.string().optional(),
  // Update when user chat
  latestMessage: z.any().optional(),
  // Update when user chat
  latestMessageCreatedAt: z.date().optional(),
  // Update when user chat
  createdAt: z.date().optional(),
});

export const ConversationConditionDTOSchema = z.object({
  sender: z.any().optional(),
  room: z.string().optional(),
  latestMessage: z.any().optional(),
  createdAt: z.date().optional(),
});

export const MessageConditionDTOSchema = z.object({
  sender: z.any().optional(),
  participants: z.array(z.string()).optional(),
  content: z.string().optional(),
  createdAt: z.date().optional(),
  conversation: z.any().optional(),
});

export type CreateConversationDTO = z.infer<typeof CreateConversationDTOSchema>;
export type CreateMessageDTO = z.infer<typeof CreateMessageDTOSchema>;
export type UpdateMessageDTO = z.infer<typeof UpdateMessageDTOSchema>;
export type UpdateConversationDTO = z.infer<typeof UpdateConversationDTOSchema>;
export type ConversationConditionDTO = z.infer<typeof ConversationConditionDTOSchema>;
export type MessageConditionDTO = z.infer<typeof MessageConditionDTOSchema>;

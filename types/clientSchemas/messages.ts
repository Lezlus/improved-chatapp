import { z } from 'zod';
import { messageReceiptSchema } from './messageReceipts'; 
import { userUnpopulatedSchema } from './userUnpopulated';

export const messagesSchema = z.object({
  _id: z.string(),
  type: z.enum(["GROUP", "PRIVATE"]),
  groupId: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string().optional(),
  content: z.string(),
  createAt: z.string(),
  updatedAt: z.string(),
  messageReceipt: messageReceiptSchema
})

export const createMessageSchema = z.object({
  type: z.enum(["GROUP", "PRIVATE"]),
  groupId: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string().optional(),
  content: z.string(),
})

export const directMessageSchemaType = z.object({
  _id: z.string(),
  type: z.enum(["PRIVATE"]),
  groupId: z.string().optional(),
  senderId: userUnpopulatedSchema,
  receiverId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  messageReceipt: messageReceiptSchema
})

export const groupMessageSchemaType = z.object({
  _id: z.string(),
  type: z.enum(["GROUP"]),
  groupId: z.string(),
  senderId: userUnpopulatedSchema,
  receiverId: z.string().optional(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const validateCreateMessageSchema = (input: any) => {
  return createMessageSchema.parse(input);
}

export type MessageSchemaType = z.infer<typeof messagesSchema>
export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
export type DirectMessageSchemaType = z.infer<typeof directMessageSchemaType>;
export type GroupMessageSchemaType = z.infer<typeof groupMessageSchemaType>;
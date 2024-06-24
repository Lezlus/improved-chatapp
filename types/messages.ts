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

export const populatedMessageSchema = z.object({
  _id: z.string(),
  type: z.enum(["GROUP", "PRIVATE"]),
  groupId: z.string().optional(),
  senderId: userUnpopulatedSchema,
  receiverId: z.string().optional(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  messageReceipt: messageReceiptSchema
})

export const validateCreateMessageSchema = (input: any) => {
  return createMessageSchema.parse(input);
}

export type MessageSchemaType = z.infer<typeof messagesSchema>
export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
export type PopulatedMessageSchemaType = z.infer<typeof populatedMessageSchema>;

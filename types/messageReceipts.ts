import { z } from 'zod';

export const messageReceiptSchema = z.object({
  _id: z.string(),
  messageId: z.string(),
  userId: z.string(),
  status: z.enum(["DELIVERED", "READ"]),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const createMessageReceiptSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
  status: z.enum(["DELIVERED", "READ"]),
})

export type MessageReceiptSchemaType = z.infer<typeof messageReceiptSchema>;
export type CreateMessageReceiptSchemaType = z.infer<typeof createMessageReceiptSchema>;

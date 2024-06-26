import { z } from 'zod';

export const userUnpopulatedSchema = z.object({
  _id: z.string(),
  username: z.string(),
  password: z.string(),
  messages: z.string().array(),
  friendInvites: z.string().array(),
  groupChatInvites: z.string().array(),
  groups: z.string().array(),
  friends: z.string().array(),
  createdAt: z.string(),
  updatedAt: z.string()
})
export type UserUnpopulatedType = z.infer<typeof userUnpopulatedSchema>;
import { z } from 'zod';

export const userUnpopulatedSchema = z.object({
  _id: z.string(),
  username: z.string(),
  messages: z.string().array(),
  friendInvites: z.string().array(),
  groupChatInvites: z.string().array(),
  groups: z.string().array(),
  friends: z.string().array(),
  createdAt: z.string(),
  updatedAt: z.string(),
  activityStatus: z.enum(["ONLINE", "OFFLINE", "AWAY", "DO NOT DISTURB", "IDLE"]),
  online: z.boolean().default(false),

})
export type UserUnpopulatedType = z.infer<typeof userUnpopulatedSchema>;
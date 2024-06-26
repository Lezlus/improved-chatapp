import { z } from 'zod';
import { groupsSchema } from './groups';

export const groupChatInvitesSchema = z.object({
  senderId: z.string(),
  receiverId:z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  groupId: groupsSchema
})

export type GroupChatInviteSchemaType = z.infer<typeof groupChatInvitesSchema>;
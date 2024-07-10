import { z } from 'zod';
import { groupsSchema } from './groups';

export const groupChatInvitesSchema = z.object({
  _id: z.string(),
  sender: z.string(),
  receiver:z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  group: groupsSchema
})

export const createGroupChatInviteSchema = z.object({
  sender: z.string(),
  receiver: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  group: z.string(),
})

export const validateGroupChatInviteSchema = (input: any) => {
  return groupChatInvitesSchema.parse(input);
}

export const validateCreateGroupChatInviteSchema = (input: any) => {
  return createGroupChatInviteSchema.parse(input);
}
export type GroupChatInviteSchemaType = z.infer<typeof groupChatInvitesSchema>;
export type CreateGroupChatInviteSchemaType = z.infer<typeof createGroupChatInviteSchema>;
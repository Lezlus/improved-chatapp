import { z } from 'zod';
import { validateSchemaData } from '.';
import { userUnpopulatedSchema } from './userUnpopulated';

export const friendInvitesSchema = z.object({
  _id: z.string(),
  receiver: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  sender: userUnpopulatedSchema,
})

export const OutGoingFriendInviteSchema = z.object({
  _id: z.string(),
  receiver: userUnpopulatedSchema,
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  sender: z.string(),
})

const createFriendInviteSchema = z.object({
  receiver: z.string(),
  sender: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"])
})

const updateFriendInviteSchema = z.object({
  _id: z.string(),
  sender: z.string(),
  receiver: z.string()
})

const getFriendInviteSchema = z.object({
  id: z.string()
})

export const validateCreteFriendInviteSchema = (input: any) => {
  return createFriendInviteSchema.parse(input);
}

export const validateGetFriendInviteSchema = (input: any) => {
  return getFriendInviteSchema.parse(input);
}

export const validateUpdateFriendInviteSchema = (input: any) => {
  return updateFriendInviteSchema.parse(input);
}

export type FriendInviteSchemaType = z.infer<typeof friendInvitesSchema>;
export type OutGoingFriendInviteSchemaType = z.infer<typeof OutGoingFriendInviteSchema>;
export type CreateFriendInviteSchemaType = z.infer<typeof createFriendInviteSchema>;
export type UpdateFriendInviteSchemaType = z.infer<typeof updateFriendInviteSchema>;
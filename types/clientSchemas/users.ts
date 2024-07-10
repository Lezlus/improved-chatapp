import { z } from "zod";
import { 
  validateSchemaData
} from '.';
import { messagesSchema } from './messages';
import { friendInvitesSchema } from "./friendInvites";
import { userUnpopulatedSchema } from './userUnpopulated';
import { groupChatInvitesSchema } from "./groupChatInvites";
import { groupsSchema } from './groups'

export const UsersDataValidationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: messagesSchema.array(),
  friendInvites: friendInvitesSchema.array(),
  groupChatInvites: groupChatInvitesSchema.array(),
  groups: groupsSchema.array(),
  friends: userUnpopulatedSchema.array(),
})

const UserLoginRegistrationSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5),
})

const getUserSchema = z.object({
  username: z.string().min(3)
})

export const validateUsersSchema = (input: any) => {
  const data = UsersDataValidationSchema.parse(input);
  return data;
}

export const validateRegisterLoginUser = (input: any) => {
  return UserLoginRegistrationSchema.safeParseAsync(input);
}

export const validateGetUserSchema = (input: any) => {
  return getUserSchema.parse(input);
}


export type UserRegisterAndLoginType = z.infer<typeof UserLoginRegistrationSchema>;
export type UserType = z.infer<typeof UsersDataValidationSchema>;
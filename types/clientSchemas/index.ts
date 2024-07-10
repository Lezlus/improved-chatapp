import { z, ZodSchema } from 'zod';

export const validateSchemaData = (input: any, schema: ZodSchema) => {
  const data = schema.parse(input);
  return data;
}

export { 
  type UserType, 
  type UserRegisterAndLoginType,
  validateUsersSchema,
  validateRegisterLoginUser,
  validateGetUserSchema,
} from './users'
export { 
  type UserUnpopulatedType,
} from './userUnpopulated'
export { 
  type GroupSchemaType,
  type CreateGroupSchemaType,
  validateCreateGroupSchema,
  validateGetGroupSchema
} from "./groups"
export { 
  type GroupMembershipType,
  type CreateGroupMembershipType,
} from './groupMemberships'
export { 
  type MessageReceiptSchemaType, 
  type CreateMessageReceiptSchemaType,
  messageReceiptSchema 
} from './messageReceipts'
export { 
  type MessageSchemaType, 
  type DirectMessageSchemaType,
  type CreateMessageSchemaType,
  type GroupMessageSchemaType,
  validateCreateMessageSchema,
} from './messages'
export { 
  type GroupChatInviteSchemaType,
  type CreateGroupChatInviteSchemaType,
  validateCreateGroupChatInviteSchema,
  validateGroupChatInviteSchema,
} from './groupChatInvites'
export { 
  validateCreteFriendInviteSchema,
  validateGetFriendInviteSchema,
  validateUpdateFriendInviteSchema,
  type FriendInviteSchemaType, 
  type OutGoingFriendInviteSchemaType, 
  type CreateFriendInviteSchemaType, 
  type UpdateFriendInviteSchemaType
} from './friendInvites'


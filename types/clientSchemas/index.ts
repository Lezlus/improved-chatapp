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
  type GroupMembershipType
} from './groupMemberships'
export { 
  type MessageReceiptSchemaType, 
  type CreateMessageReceiptSchemaType,
  messageReceiptSchema 
} from './messageReceipts'
export { 
  type MessageSchemaType, 
  type PopulatedMessageSchemaType,
  type CreateMessageSchemaType,
  validateCreateMessageSchema,
} from './messages'
export { 
  type GroupChatInviteSchemaType,
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


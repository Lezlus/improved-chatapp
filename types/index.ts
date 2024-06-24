import { z, ZodSchema } from 'zod';

export const validateSchemaData = (input: any, schema: ZodSchema) => {
  const data = schema.parse(input);
  return data;
}

export { type UserType, validateUsersSchema } from './users'
export { userUnpopulatedSchema } from './userUnpopulated'
export { groupsSchema } from "./groups"
export { groupMembershipsSchema } from './groupMemberships'
export { type MessageReceiptSchemaType, messageReceiptSchema } from './messageReceipts'
export { type MessageSchemaType, messagesSchema } from './messages'
export { groupChatInvitesSchema } from './groupChatInvites'
export { friendInvitesSchema } from './friendInvites'


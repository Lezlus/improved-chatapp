import mongoose, { Document, Schema, Model } from "mongoose";
import {  
  GroupMembershipsSchema,
  GroupMembershipSchemaType,
  GroupMembershipModel,
  GroupsSchema,
  GroupSchemaType,
  GroupModel,
  MessagesSchema,
  MessageSchemaType,
  MessageModel,
  UsersSchema,
  UsersSchemaType,
  UserSchemaMethods,
  UserModel,
  MessageReceiptsSchema, 
  MessageReceiptSchemaType,
  MessageReceiptModel,
  FriendInvitesSchema,
  FriendInviteSchemaType,
  FriendInviteModel,
  GroupChatInvitesSchema,
  GroupChatInviteSchemaType,
  GroupChatInviteModel
} from './modelSchemas';

export const connect = async () => {
  try {
    const conn = await mongoose
      .connect(process.env.MONGO_URL!)
      .catch(err => console.log(err))
    
      console.log("mognoDB connection established");

      const Users: Model<UsersSchemaType, {}, UserSchemaMethods> = mongoose.models.users || mongoose.model<UsersSchemaType, UserModel>("users", UsersSchema);
      const GroupMemberships: Model<GroupMembershipSchemaType> = mongoose.models.groupMemberships || mongoose.model<GroupMembershipSchemaType, GroupMembershipModel>("groupMemberships", GroupMembershipsSchema);
      const Groups: Model<GroupSchemaType> = mongoose.models.groups || mongoose.model<GroupSchemaType, GroupModel>("groups", GroupsSchema);
      const Messages: Model<MessageSchemaType> = mongoose.models.messages || mongoose.model<MessageSchemaType, MessageModel>("messages", MessagesSchema);
      const MessageReceipts: Model<MessageReceiptSchemaType> = mongoose.models.messageReceipts || mongoose.model<MessageReceiptSchemaType, MessageReceiptModel>("messageReceipts", MessageReceiptsSchema);
      const GroupChatInvites: Model<GroupChatInviteSchemaType> = mongoose.models.groupChatInvites || mongoose.model<GroupChatInviteSchemaType, GroupChatInviteModel>("groupChatInvites", GroupChatInvitesSchema);
      const FriendInvites: Model<FriendInviteSchemaType> = mongoose.models.friendInvites || mongoose.model<FriendInviteSchemaType, FriendInviteModel>("friendInvites", FriendInvitesSchema);

      return { conn, Users, Groups, GroupMemberships, Messages, MessageReceipts, GroupChatInvites, FriendInvites };
  } catch (e) {
    console.log("Error when connecting", e);
    throw e
  }
}
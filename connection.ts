import mongoose, { Document, Schema, Model } from "mongoose";
import {  
  GroupMembershipsSchema,
  GroupMembershipsSchemaType,
  GroupsSchema,
  GroupsSchemaType,
  MessagesSchema,
  MessagesSchemaType,
  UsersSchema,
  UsersSchemaType,
  UserSchemaMethods,
  UserModel,
  MessageReceiptsSchema, 
  MessageReceiptsSchemaType,
  FriendInvitesSchema,
  FriendInviteType,
  GroupChatInvitesSchema,
  GroupChatInvitesType,
} from './modelSchemas';

export const connect = async () => {
  try {
    const conn = await mongoose
      .connect(process.env.MONGO_URL!)
      .catch(err => console.log(err))
    
      console.log("mognoDB connection established");

      const Users: Model<UsersSchemaType, {}, UserSchemaMethods> = mongoose.models.users || mongoose.model<UsersSchemaType, UserModel>("users", UsersSchema);
      const GroupMemberships: Model<Document<GroupMembershipsSchemaType>> = mongoose.models.groupMemberships || mongoose.model("groupMemberships", GroupMembershipsSchema);
      const Groups: Model<Document<GroupsSchemaType>> = mongoose.models.groups || mongoose.model("groups", GroupsSchema);
      const Messages: Model<Document<MessagesSchemaType>> = mongoose.models.messages || mongoose.model("messages", MessagesSchema);
      const MessageReceipts: Model<Document<MessageReceiptsSchemaType>> = mongoose.models.messageReceipts || mongoose.model("messageReceipts", MessageReceiptsSchema);
      const GroupChatInvites: Model<Document<GroupChatInvitesType>> = mongoose.models.groupChatInvites || mongoose.model("groupChatInvites", GroupChatInvitesSchema);
      const FriendInvites: Model<Document<FriendInviteType>> = mongoose.models.friendInvites || mongoose.model("friendInvites", FriendInvitesSchema);

      return { conn, Users, Groups, GroupMemberships, Messages, MessageReceipts, GroupChatInvites, FriendInvites };
  } catch (e) {
    console.log("Error when connecting", e);
    throw e
  }
}
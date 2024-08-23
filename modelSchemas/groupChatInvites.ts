import mongoose, { Schema, Document, ObjectId, Model, Types } from "mongoose";

type StatusType = "PENDING" | "ACCEPTED" | "DECLINED";
const StatusTypes = ["PENDING", "ACCEPTED", "DECLINED"] as const;

export interface GroupChatInviteSchemaType {
  group: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

export type GroupChatInviteModel = Model<GroupChatInviteSchemaType>

const GroupChatInvitesSchema = new Schema<GroupChatInviteSchemaType>({
  group: { type: Schema.ObjectId, required: true, ref: "groups" },
  sender: { type: Schema.ObjectId, required: true, ref: "users" },
  receiver: { type: Schema.ObjectId, required: true, ref: "users" },
  status: { type: String, enum: StatusTypes, default: "PENDING" },
}, { timestamps: true });

export { GroupChatInvitesSchema };
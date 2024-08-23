import mongoose, { Schema, Document, ObjectId, Types, Model } from "mongoose";

// enum MessageType {
//   Group = "GROUP",
//   Private = "PRIVATE"
// }

type MessageType = "GROUP" | "PRIVATE";
const MessageTypes = ["GROUP", "PRIVATE"] as const;


export interface MessageSchemaType {
  type: MessageType;
  groupId?: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  messageReceipt?: Types.ObjectId;
  content: string;
  createdAt: string;
  updatedAt: string;
} 

export type MessageModel = Model<MessageSchemaType>;

export const MessagesSchema = new Schema<MessageSchemaType, MessageModel>({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "groups", required: false },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false},
  content: { type: String },
  type: { type: String, enum: MessageTypes, default: "PRIVATE"},
  messageReceipt: { type: Schema.ObjectId, ref: "messageReceipts", required: false },
}, { timestamps: true });
import mongoose, { Schema, Document, ObjectId, Types, Model } from "mongoose";

// enum StatusType {
//   Delivered = "DELIVERED",
//   Read = "READ"
// }

type StatusType = "DELIVERED" | "READ";
const StatusTypes = ["DELIVERED", "READ"] as const;

export interface MessageReceiptSchemaType {
  messageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageReceiptModel = Model<MessageReceiptSchemaType>

export const MessageReceiptsSchema = new Schema<MessageReceiptSchemaType, MessageReceiptModel>({
  messageId: { type: Schema.Types.ObjectId, ref: "messages", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  status: { type: String, enum: StatusTypes, default: "DELIVERED" }
}, {timestamps: true})
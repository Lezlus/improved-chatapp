import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

// enum StatusType {
//   Delivered = "DELIVERED",
//   Read = "READ"
// }

type StatusType = "DELIVERED" | "READ";
const StatusTypes = ["DELIVERED", "READ"] as const;

export interface MessageReceiptsSchemaType {
  messageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}

export const MessageReceiptsSchema = new Schema<MessageReceiptsSchemaType>({
  messageId: { type: Schema.Types.ObjectId, ref: "messages", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  status: { type: String, enum: StatusTypes, default: "DELIVERED" }
}, {timestamps: true})
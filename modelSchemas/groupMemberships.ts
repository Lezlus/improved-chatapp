import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

export interface GroupMembershipsSchemaType {
  group: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export const GroupMembershipsSchema = new Schema<GroupMembershipsSchemaType>({
  group: { type: Schema.ObjectId, ref: "groups" },
  user: { type: Schema.ObjectId, ref: "users" },
}, { timestamps: true });


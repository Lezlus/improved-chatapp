import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

export interface GroupsSchemaType extends Document {
  groupName: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  groupMemberships: Types.ObjectId[];
}

export const GroupsSchema = new Schema<GroupsSchemaType>({
  groupMemberships: [{ type: Schema.ObjectId, ref: "groupMemberships", required: true }],
  groupName: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, unique: true, required: true, ref: "users" }
}, { timestamps: true });

import mongoose, { Schema, Document, ObjectId, Types, Model } from "mongoose";

export interface GroupSchemaType extends Document {
  groupName: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  groupMemberships: Types.ObjectId[];
}

export type GroupModel = Model<GroupSchemaType>

export const GroupsSchema = new Schema<GroupSchemaType, GroupModel>({
  groupMemberships: [{ type: Schema.ObjectId, ref: "groupMemberships", required: true }],
  groupName: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" }
}, { timestamps: true });

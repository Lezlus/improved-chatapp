import mongoose, { Schema, Document, ObjectId, Types, Model } from "mongoose";

export interface GroupMembershipSchemaType {
  group: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type GroupMembershipModel = Model<GroupMembershipSchemaType>;

export const GroupMembershipsSchema = new Schema<GroupMembershipSchemaType, GroupMembershipModel>({
  group: { type: Schema.ObjectId, ref: "groups" },
  user: { type: Schema.ObjectId, ref: "users" },
}, { timestamps: true });


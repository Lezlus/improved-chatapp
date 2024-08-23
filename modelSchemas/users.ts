import mongoose, { Schema, Document, ObjectId, Model, Types } from "mongoose";
import bcrypt from 'bcrypt';

type ComparePasswordCB = (error: any, isMatch: any) => void

export type ActivityStatusType = "ONLINE" | "OFFLINE" | "AWAY" | "DO NOT DISTURB" | "IDLE";
const ActivityStatusTypes = ["ONLINE", "OFFLINE", "AWAY", "DO NOT DISTURB", "IDLE"]

export interface UsersSchemaType {
  username: string;
  password: string;
  messages: Types.ObjectId[];
  friendInvites: Types.ObjectId[];
  groupChatInvites: Types.ObjectId[];
  groups: Types.ObjectId[];
  friends: Types.ObjectId[];
  activityStatus: ActivityStatusType;
  online: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSchemaMethods {
  comparePassword(password: string, cb: ComparePasswordCB): void;
}

type UserModel = Model<UsersSchemaType, {}, UserSchemaMethods>;

const UsersSchema = new Schema<UsersSchemaType, UserModel, UserSchemaMethods>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  messages: [{ type: Schema.ObjectId, required: true, ref: "messages" }],
  friendInvites: [{ type: Schema.ObjectId, required: true, ref: "friendInvites" }],
  groupChatInvites: [{ type: Schema.ObjectId, required: true, ref: "groupChatInvites" }],
  groups: [{ type: Schema.ObjectId, required: true, ref: "groups" }],
  friends: [{ type: Schema.ObjectId, required: true, ref: "users" }],
  activityStatus: { type: String, enum: ActivityStatusTypes, default: "OFFLINE" },
  online: { type: Boolean, default: false, required: true }
}, {timestamps: true});

UsersSchema.method("comparePassword", function comparePassword(password: string, cb: ComparePasswordCB) {
  bcrypt.compare(password, this.password, (err: Error | undefined, isMatch: boolean) => {
    cb(err, isMatch);
  });
})


export { UsersSchema, type UserModel };
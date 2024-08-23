import { Schema, model, Types, Model } from 'mongoose';

// enum StatusType {
//   Pending = "PENDING",
//   Accepted = "ACCEPTED",
//   Declined = "DECLINED",
// }

type StatusType = "PENDING" | "ACCEPTED" | "DECLINED";
const StatusTypes = ["PENDING", "ACCEPTED", "DECLINED"] as const;


export interface FriendInviteSchemaType {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

export type FriendInviteModel = Model<FriendInviteSchemaType>;

const FriendInvitesSchema = new Schema<FriendInviteSchemaType, FriendInviteModel>({
  sender: { type: Schema.ObjectId, required: true, ref: "users" },
  receiver: { type: Schema.ObjectId, required: true, ref: "users" },
  status: { type: String, enum: StatusTypes, default: "PENDING" }
}, { timestamps: true });

export { FriendInvitesSchema };
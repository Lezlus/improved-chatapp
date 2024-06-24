import { Schema, model, Types } from 'mongoose';

// enum StatusType {
//   Pending = "PENDING",
//   Accepted = "ACCEPTED",
//   Declined = "DECLINED",
// }

type StatusType = "PENDING" | "ACCEPTED" | "DECLINED";
const StatusTypes = ["PENDING", "ACCEPTED", "DECLINED"] as const;


export interface FriendInviteType {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: StatusType;
  createdAt: string;
  updatedAt: string;
}

const FriendInvitesSchema = new Schema<FriendInviteType>({
  sender: { type: Schema.ObjectId, required: true, ref: "users" },
  receiver: { type: Schema.ObjectId, required: true, ref: "users" },
  status: { type: String, enum: StatusTypes, default: "PENDING" }
}, { timestamps: true });

export { FriendInvitesSchema };
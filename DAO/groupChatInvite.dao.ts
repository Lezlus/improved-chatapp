import { connect } from "../connection";
import { CreateGroupChatInviteSchemaType, GroupChatInviteSchemaType } from "../types/clientSchemas";

class GroupChatInviteDAO {
  async createGroupChatInvite(data: CreateGroupChatInviteSchemaType) {
    const { Users, GroupChatInvites } = await connect();
    const newGroupChatInvite = await GroupChatInvites.create(data);
    const populatedGroupChatInvite = await newGroupChatInvite
      .populate([
        { path: "group", populate: [{ path: "groupMemberships", populate: "user" }, { path: "createdBy" }] },
      ]);
    
    await Users.findByIdAndUpdate(data.receiver, {
      $push: { groupChatInvites: newGroupChatInvite._id }
    });

    return populatedGroupChatInvite;
  }

  async getGroupChatInvite(data: CreateGroupChatInviteSchemaType) {
    const { GroupChatInvites } = await connect();
    const groupChatInvite = await GroupChatInvites.findOne({ group: data.group, receiver: data.receiver, status: "PENDING" });
    return groupChatInvite;
  }

  async acceptGroupChatInvite(data: GroupChatInviteSchemaType) {
    const { Users, GroupChatInvites, GroupMemberships, Groups } = await connect();
    
    await GroupChatInvites.findByIdAndUpdate(data._id, { status: "ACCEPTED" });
    const groupMembership = await GroupMemberships.create({
      user: data.receiver,
      group: data.group._id
    });

    const group = await Groups.findByIdAndUpdate(data.group._id, {
      $push: { groupMemberships: groupMembership._id }
    }, { new: true }).populate("groupMemberships");

    await Users.findByIdAndUpdate(data.receiver, {
      $push: { groups: data.group._id },
      $pull: { groupChatInvites: data._id }
    });

    return group;
  }

  async declineGroupChatInvite(data: GroupChatInviteSchemaType) {
    const { Users, GroupChatInvites, GroupMemberships, Groups } = await connect();
    await GroupChatInvites.findByIdAndUpdate(data._id, { status: "DECLINED" });
    await Users.findByIdAndUpdate(data.receiver, {
      $pull: { groupChatInvites: data._id }
    });
  }
}

export const groupChatInviteDAO = new GroupChatInviteDAO()
import { connect } from "../connection";
import { CreateGroupMembershipType, CreateGroupSchemaType } from "../types/clientSchemas";


class GroupDAO {
  async getGroupMessages(groupId: string) {
    const { Messages } = await connect();
    const messages = await Messages.find({
      groupId
    })
    .sort({ createdAt: 1 })
    .populate("senderId")
    return messages
  }

  async getGroup(name: string) {
    const { Groups } = await connect();
    const group = await Groups.findOne({groupName: name})
      .populate([
        { path: "groupMemberships", populate: "user" },
        { path: "createdBy" }
      ]);
    return group;
  }

  async createGroup(group: CreateGroupSchemaType) {
    const { Groups, Users, GroupMemberships } = await connect();
    const newGroup = await Groups.create(group)
    const newGroupMembership = await GroupMemberships.create({
      group: newGroup._id,
      user: group.createdBy
    });

    const populatedGroup = await Groups.findByIdAndUpdate(newGroup._id, {
      $push: { groupMemberships: newGroupMembership._id }
    }, { new: true }).populate([
        { path: "groupMemberships", populate: "user" },
        { path: "createdBy" }
      ])

    await Users.findByIdAndUpdate(group.createdBy, {
      $push: { groups: populatedGroup?._id }
    });

    return populatedGroup;
  }
}

const groupDAO = new GroupDAO();
export { groupDAO };
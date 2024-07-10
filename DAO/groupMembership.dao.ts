import { connect } from "../connection";

class GroupMembershipDAO {
  async get(groupId: string, userId: string) {
    const { GroupMemberships } = await connect();
    const groupMembership = await GroupMemberships.findOne({ user: userId, group: groupId })
      .populate('user')
    return groupMembership
  }
}

export const groupMembershipDAO = new GroupMembershipDAO();
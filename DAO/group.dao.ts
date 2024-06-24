import { connect } from "../connection";
import { CreateGroupSchemaType } from "../types/groups";

class GroupDAO {
  async getGroup(name: string) {
    const { Groups } = await connect();
    const group = await Groups.findOne({groupName: name})
      .populate({ path: "groupMemberships", populate: "user" });
    return group;
  }

  async createGroup(group: CreateGroupSchemaType) {
    const { Groups } = await connect();
    const newGroup = await Groups.create(group);
    return newGroup;
  }
}

const groupDAO = new GroupDAO();
export { groupDAO };
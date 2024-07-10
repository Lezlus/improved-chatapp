import { connect } from "../connection";

class UserDAO {
  async getUserById(id: string) {
    const { Users } = await connect();
    const user = await Users.findById(id)
      .populate([
        { path: "messages", populate: "messageReceipt" },
        { path: "friendInvites", populate: "sender" },
        { path: "groupChatInvites", populate: [{ path: "group", populate: [{ path: "groupMemberships", populate: "user" }, { path: "createdBy" }] }] },
        { path: "groups", populate: [{ path: "groupMemberships", populate: "user" }, { path: "createdBy" }] },
        { path: "friends" },
      ])
    if (!user) {
      throw new Error("User Not Found");
    }
    return user;
  }

  async getUserByUsername(username: string) {
    const { Users } = await connect();
    const user = await Users.findOne({username})
      .populate([
        { path: "messages", populate: "messageReceipt" },
        { path: "friendInvites", populate: "sender" },
        { path: "groupChatInvites", populate: [{ path: "group", populate: [{ path: "groupMemberships", populate: "user" }, { path: "createdBy" }] }] },
        { path: "groups", populate: [{ path: "groupMemberships", populate: "user" }, { path: "createdBy" }] },
        { path: "friends" },
      ])
    return user;
  }

  async getUserByUsernameUnPopulated(username: string) {
    const { Users } = await connect();
    const user = await Users.findOne({username})
    return user;
  }

  async getUserByIdUnpopulated(id: string) {
    const { Users } = await connect()  
    const user = await Users.findById(id);
    return user;
  }
}

export const userDAO = new UserDAO();
import { connect } from "../connection";
import { ActivityStatusType } from "../modelSchemas/users";

class UserDAO {
  async getUserById(id: string) {
    const { Users } = await connect();
    const user = await Users.findById(id)
      .populate([
        { path: "messages", populate: "messageReceipt" },
        { path: "friendInvites", populate: { path: "sender", select: "-password" } },
        { path: "groupChatInvites", populate: [{ path: "group", populate: [{ path: "groupMemberships", populate: { path: "user", select: "-password" } }, { path: "createdBy", select: "-password" }] }] },
        { path: "groups", populate: [{ path: "groupMemberships", populate: { path: "user", select: "-password" } }, { path: "createdBy", select: "-password" }] },
        { path: "friends", select: "-password" },
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
        { path: "friendInvites", populate: { path: "sender", select: "-password" } },
        { path: "groupChatInvites", populate: [{ path: "group", populate: [{ path: "groupMemberships", populate: { path: "user", select: "-password" } }, { path: "createdBy", select: "-password" }] }] },
        { path: "groups", populate: [{ path: "groupMemberships", populate: { path: "user", select: "-password" } }, { path: "createdBy", select: "-password" }] },
        { path: "friends", select: "-password" },
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

  async updateActivityStatus(id: string, status: ActivityStatusType) {
    const { Users } = await connect()  
    const user = await Users.findByIdAndUpdate(id, { activityStatus: status }, { new: true });
    return user;
  }

  async goOnline(id: string, status: ActivityStatusType) {
    const { Users } = await connect()  
    const savedUser = await Users.findById(id);

    let user;
    if (savedUser?.activityStatus === "OFFLINE") {
      user = await Users.findByIdAndUpdate(id, { online: true, activityStatus: "ONLINE" }, { new: true });
    } else {
      user = await Users.findByIdAndUpdate(id, { online: true }, { new: true });
    }
    return user;
  }

  async goOffline(id: string, status: ActivityStatusType) {
    const { Users } = await connect();

    const savedUser = await Users.findById(id);

    let user;
    if (savedUser?.activityStatus === "ONLINE") {
      user = await Users.findByIdAndUpdate(id, { online: false, activityStatus: "OFFLINE" }, { new: true });
    } else {
      user = await Users.findByIdAndUpdate(id, { online: false }, { new: true });
    }
    return user;
  }
}

export const userDAO = new UserDAO();
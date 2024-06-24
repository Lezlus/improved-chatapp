import { connect } from "../connection";
import { CreateFriendInviteSchemaType } from "../types/friendInvites";

class FriendInviteDAO {
  // Create and push id to receiver friend invites
  async createFriendInvite(data: CreateFriendInviteSchemaType) {
    const { FriendInvites, Users } = await connect();
    const { receiver } = data;
    const newFriendInvite = await FriendInvites.create(data);
    await Users.findByIdAndUpdate(receiver, {
      $push: { friendInvites: newFriendInvite._id }
    });
    return newFriendInvite;
  }

  async getOutGoingFriendInvites(data: { id: string }) {
    const { id } = data;
    const { FriendInvites } = await connect();
    const outgoingFriendInvites = await FriendInvites.find({ sender: id, status: "PENDING" })
      .populate("receiver");
    return outgoingFriendInvites;
  }

  async acceptFriendInvite(id: string, sender: string, receiver: string) {
    const { FriendInvites, Users } = await connect();
    // Change friend invite to ACCEPTED
    // Push new friend to sender.friends
    // Push new friend to receiver.friends
    // Pull friend invite from receiver.friendInvites

    await FriendInvites.findByIdAndUpdate(id, { status: "ACCEPTED" });
    await Users.findByIdAndUpdate(sender, {
      $push: { friends: receiver }
    })
    let user = await Users.findByIdAndUpdate(receiver, {
      $push: { friends: sender }, 
      $pull: { friendInvites: id }
    }, { new: true }).populate([
      { path: "friendInvites", populate: "sender" },
      { path: "friends" },
    ])
    return user;
  }

  async declineFriendInvite(id: string, sender: string, receiver: string) {
    const { FriendInvites, Users } = await connect();
    // Change friend invite from PENDING to DECLINED
    // Pull friend invite from receiver.friendInvites

    await FriendInvites.findByIdAndUpdate(id, { status: "DECLINED" }, { new: true });
    let user = await Users.findByIdAndUpdate(receiver, {
      $pull: { friendInvites: id }
    }, { new: true })
    .populate([{ path: "friendInvites", populate: "sender" }, { path: "friends" }]);
    return user;
  }

}

const friendInviteDAO = new FriendInviteDAO();
export { friendInviteDAO };
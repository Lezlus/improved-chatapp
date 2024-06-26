import { connect } from '../connection';
import { CreateMessageReceiptSchemaType } from '../types/clientSchemas/messageReceipts';
import { CreateMessageSchemaType } from '../types/clientSchemas/messages';

class MessageDAO {
  async getMessagesBetweenUsers(currentUser: string, nextUser: string) {
    const { Messages } = await connect();
    const messages = await Messages.find({
      $or: [
        { senderId: currentUser, receiverId: nextUser },
        { senderId: nextUser, receiverId: currentUser }
      ]
    }).sort({ createdAt: 1 })
    .populate("messageReceipt")
    .populate("senderId");
    return messages;
  }

  async createMessage(data: CreateMessageSchemaType) {
    const { Messages, MessageReceipts } = await connect();
    const { senderId, receiverId, type } = data;
    if (type === "PRIVATE" && receiverId) {
      const newMessage = await Messages.create(data)
      const newMessageReceipt = await MessageReceipts.create({
        status: "DELIVERED",
        messageId: newMessage._id,
        userId: senderId,
      });
      const message = await Messages.findByIdAndUpdate(newMessage._id, {
        messageReceipt: newMessageReceipt._id
      }, { new: true }).populate("messageReceipt").populate("senderId");
      return message;
    } else {
      const newMessage = await Messages.create(data);
      return newMessage;
    }
  }
}

export const messageDAO = new MessageDAO();
import ConversationModel from "../models/conversations/conversation.model.js";
import MessageModel from "../models/messages/message.model.js";
import User from "../models/users/users.model.js";

const getUserSocketId = async (userId) => {
  const user = await User.findOne({ _id: userId });
  return user ? user.socketId : null;
};

export const socketManager = (io) => (socket) => {
  socket.on("mark_user_online", async (userId) => {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { socketId: socket.id },
      { new: true }
    );
    const updatedMessage = await MessageModel.updateMany(
      {
        $and: [
          { participants: { $in: [userId] } },
          { author: { $ne: userId } },
        ],
      },
      {
        $set: { isRecived: true },
      },
      { new: true }
    );
    if (user) {
      io.emit(`user_update_${user._id}`, user);
    }
  });

  // send Message
  socket.on("send_message", async (message) => {
    const updatedConversation = await ConversationModel.findOneAndUpdate(
      {
        _id: message.conversationId,
      },
      { $set: { lastMessage: message._id } },
      { new: true }
    );
    if (updatedConversation) {
      const reciverUserId =
        updatedConversation.participants[0].toString() ===
        message.author._id.toString()
          ? updatedConversation.participants[1].toString()
          : updatedConversation.participants[0].toString();

      const populatedConversation = await updatedConversation
        .populate("participants")
        .populate("lastMessage");
      const socketId = await getUserSocketId(reciverUserId);
      if (socketId) {
        io.to(socketId).emit(`update_Conversation`, populatedConversation);
        io.to(socketId).emit(`new_message`, message);
      }
    }
  });

  // when disconnect
  socket.on("disconnect", async () => {
    const disconnectedUser = await User.findOneAndUpdate(
      { socketId: socket.id },
      {
        $set: { socketId: null },
      },
      { new: true }
    );
    if (disconnectedUser) {
      io.emit(`user_update_${disconnectedUser._id}`, disconnectedUser);
    }
    console.log("disconnect");
  });
};

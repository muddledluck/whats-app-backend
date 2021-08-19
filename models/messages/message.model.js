import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyOf: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    content: {
      type: String,
      required: true,
    },
    file: {
      type: {
        url: String,
        type: String,
      },
      default: {},
    },
    isRecived: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamp: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;

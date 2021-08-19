import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    newMessage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;

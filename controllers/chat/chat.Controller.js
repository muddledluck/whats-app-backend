// Models
import ConversationModel from "../../models/conversations/conversation.model.js";
import MessageModel from "../../models/messages/message.model.js";

// Utility fies
import base64ToFileUrl from "../../utils/base64ToFile.utils.js";

// Validate the input
import validateCreateConversationInput from "../../validator/chat/createConversationInput.validator.js";
import validateCreateMessageInput from "../../validator/chat/createMessage.validator.js";

/*
 * @type: POST
 */
export const createConversation = async (req, res) => {
  const { errors, isValid } = await validateCreateConversationInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const newConversation = new ConversationModel({
      participants: [...req.body.participants, req.user._id],
    });
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    console.log("coversaoitn: ", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

/*
 * @type: GET
 */
export const getAllConversationByUser = async (req, res) => {
  try {
    const conversation = await ConversationModel.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants")
      .sort({ updateAt: -1 });
    return res.status(200).json(conversation);
  } catch (error) {
    console.log("getAllConversationOfUser: ", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

/*
 * @type: POST
 */
export const createMessage = async (req, res) => {
  try {
    const { errors, isValid } = validateCreateMessageInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newMessage = new MessageModel({
      conversationId: req.body.conversationId,
      author: req.user._id,
      content: req.body.content,
    });
    if (req.body.file) {
      const fileUrl = await base64ToFileUrl(
        req.body.file.fileUrl,
        req.user._id,
        "media"
      );
      newMessage.file = {
        url: fileUrl,
        type: req.body.file.type,
      };
    }
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.log("createMessage: ", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

/*
 * @type: GET
 */
export const getAllMessageByConversationId = async (req, res) => {
  try {
    const message = await MessageModel.find({
      conversationId: req.params.conversationId,
    }).populate("author");
    return res.status(200).json(message);
  } catch (error) {
    console.log("getAllMessageByConversationId: ", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

import express from "express";
import { authProtect } from "../controllers/authController.js";
import {
  createConversation,
  createMessage,
  getAllConversationByUser,
  getAllMessageByConversationId,
} from "../controllers/chat/chat.Controller.js";

const ChatRoute = express.Router();

ChatRoute.get(
  "/get-all-conversation-by-user",
  authProtect,
  getAllConversationByUser
);
ChatRoute.get(
  "/get-all-messaage-by-conversaton-id/:conversationId",
  authProtect,
  getAllMessageByConversationId
);

ChatRoute.post("/create-conversation", authProtect, createConversation);
ChatRoute.post("/create-message", authProtect, createMessage);

export default ChatRoute;

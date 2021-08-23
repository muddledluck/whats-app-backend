import express from "express";

import {
  getUserDetails,
  searchUserProfile,
  signIn,
  signUp,
} from "../controllers/user/userController.js";
import { authProtect } from "../controllers/authController.js";
const UserRoute = express.Router();

UserRoute.post("/sign-up", signUp);
UserRoute.post("/sign-in", signIn);

UserRoute.get("/get-user-details", authProtect, getUserDetails);
UserRoute.get(
  "/search-user-profile/:keyword",
  authProtect,
  searchUserProfile
);

export default UserRoute;

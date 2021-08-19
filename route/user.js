import express from "express";

import {
  getUserDetails,
  signIn,
  signUp,
} from "../controllers/user/userController.js";
import { authProtect } from "../controllers/authController.js";
const UserRoute = express.Router();

UserRoute.post("/sign-up", signUp);
UserRoute.post("/sign-in", signIn);

UserRoute.get("/get-user-details", authProtect, getUserDetails);

export default UserRoute;

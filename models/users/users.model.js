import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  socketId: {
    type: String,
  },
});

const User = Mongoose.model("User", UserSchema);
export default User;

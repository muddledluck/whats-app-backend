import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/users/users.model.js";
import validateSignUpInput from "../../validator/user/signUp.validator.js";
import services from "../../utils/services.js";

export const signUp = async (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (existingUser) {
      return res.status(409).json({ errors: ["User already exists"] });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
    });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) {
          console.log("err: ", err);
          return res.status(500).json({ error: err });
        }
        newUser.password = hash;
        await newUser.save();
        const payload = {
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
        };
        const token = jwt.sign(payload, services.JWT_KEY, {
          expiresIn: 31556926,
        });
        return res.status(200).json({
          message: "User registred Successfully",
          token: token,
          user: newUser,
        });
      });
    });
  } catch (error) {
    console.log("SignUp: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const details = {};
    if (req.body.email.match(re)) {
      details.email = req.body.email;
    } else {
      details.username = req.body.email;
    }
    const user = await User.findOne(details);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });
    return res.status(200).json({
      message: "User logged in Successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.log("SignIn: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  try {
    const userDetails = await User.findById(userId);
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.log("GetUserDetails: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchUserProfile = async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const userList = await User.find({
      $expr: {
        $or: [
          {
            $regexMatch: {
              input: "$name",
              regex: keyword,
              options: "im",
            },
          },
          {
            $regexMatch: {
              input: "$username",
              regex: keyword,
              options: "im",
            },
          },
        ],
      },
    }).limit(10);
    return res.status(200).json({ userList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

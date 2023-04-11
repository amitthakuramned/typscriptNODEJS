import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../api/controllers/common/constants.js";
import shortid from "shortid";
import { createWriteStream, mkdir } from "fs";

const User = mongoose.model("User");
const File = mongoose.model("File");

const UserResolvers = {
  Query: {
    user: async (_, { _id }) => await User.findOne({ _id }),
    LogedUser: async (_,{userEmail},{ userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ _id: userId, email: emailId });
        if (!user) {
          throw new Error("user doesent exist");
        }
        return user;
      } else {
        throw new Error("not authorise");
      }
    },
    users: async (_, userId, emailId) => {
      if (userId && emailId) {
        const user = await User.find({});
        if (!user) {
          throw new Error("user doesent exist");
        }
        return user;
      } else {
        throw new Error("not authorise");
      }
    },
  },
  Mutation: {
    createUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("user alraedy exist with that email");
      }
      const hashPassword = await bcrypt.hash(userNew.password, 10);

      const newUser = new User({
        ...userNew,
        password: hashPassword,
      });
      return await newUser.save();
    },
    loginUser: async (_, { userLogin }) => {
      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        throw new Error("user doesent exist with that email");
      }
      const matchPwd = await bcrypt.compare(userLogin.password, user.password);
      if (!matchPwd) {
        throw new Error("emai or Invalid Password");
      }
      const token = jwt.sign(
        { userId: user._id, emailId: userLogin.email },
        JWT_SECRET
      );
      return {
        token,
      };
    },
  },
};

export default UserResolvers;

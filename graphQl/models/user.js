import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },

  streetAddress1: {
    type: String,
    require: false,
  },
  streetAddress2: {
    type: String,
    require: false,
  },
  pinCode: {
    type: String,
    require: false,
  },
  profession: {
    type: String,
    require: false,
  },
  service: {
    type: String,
    require: false,
  },
  organisation: {
    type: String,
    require: false,
  },
  bussiness: {
    type: String,
    require: false,
  },
  message: {
    type: String,
    require: false,
  },

  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    max: 50,
  },
  from: {
    type: String,
    max: 50,
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3],
  },
},{timestamps:true}
);

mongoose.model("User", userSchema);

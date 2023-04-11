import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    max: 500,
    require: false,
  },
  img: {
    type: String,
    require: false,
  },
},{timestamps:true});

const likeSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  likeType:{
    type: Number,
    require: true,
    default:0
  }
},{timestamps:true});

const PostSchema = new mongoose.Schema({
  likes:[likeSchema],
  comments:[commentSchema],
  userId: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  img: {
    type: String,
    require: false,
  },
},{timestamps:true});

mongoose.model("Post", PostSchema);

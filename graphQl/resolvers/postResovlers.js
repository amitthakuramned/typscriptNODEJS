import mongoose from "mongoose";
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const PostResolvers = {
  Query: {
    posts: async (_, userId, emailId) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const posts = await Post.find({ userId: user?._id });
          if (!posts) {
            throw new Error("posts doesent exist");
          }
          return posts;
        } else {
          throw new Error("user doesent exist");
        }
      } else {
        throw new Error("not authorise");
      }
    },
    post: async (_, { _id }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const posts = await Post.findOne({ _id });
          if (!posts) {
            throw new Error("posts doesent exist");
          }
          return posts;
        } else {
          throw new Error("user doesent exist");
        }
      } else {
        throw new Error("not authorise");
      }
    },
  },
  Mutation: {
    createPost: async (_, { newPost }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const newPostDetail = new Post({ ...newPost });
          return await newPostDetail.save();
        } else {
          throw new Error("user doesent exist");
        }
      } else {
        throw new Error("not authorise");
      }
    },
    createComment: async (_, { newComent }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const pushComment = await Post.findOneAndUpdate(
            { _id: newComent?.postId },
            { $push: { comments: { ...newComent, userId: userId } } },
            { returnNewDocument: true }
          );
          return pushComment;
        } else {
          throw new Error("user doesent exist");
        }
      } else {
        throw new Error("not authorise");
      }
    },
    createLike: async (_, { newLike }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const post = await Post.findById({ _id: newLike.postId });
          var isLikeExit = post?.likes?.map((item) =>
            item?.userId === userId ? true : false
          );
          if (isLikeExit?.includes(true)) {
            const editNewLike = await Post.findOneAndUpdate(
              { _id: newLike?.postId },
              { $set: { "likes.$[t].likeType": newLike.likeType } },
              { arrayFilters: [{ "t.userId": userId }] }
            );
            return editNewLike;
          } else {
            const pushNewLike = await Post.findOneAndUpdate(
              { _id: newLike?.postId },
              { $push: { likes: { ...newLike, userId: userId } } },
              { returnNewDocument: true }
            );
            return pushNewLike;
          }
        } else {
          throw new Error("user doesent exist");
        }
      } else {
        throw new Error("not authorise");
      }
    },
    deletePost: async (_id, { deletePost }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const isUserPost = await Post.findOne({_id: deletePost?.postId});
          if (isUserPost) {
            const postByUser = await Post.deleteOne({_id: deletePost?.postId});
            return postByUser;
          } else {
            throw new Error("user not authorise to delete this post");
          }
        }
      } else {
        throw new Error("not authorise");
      }
    },
    deleteComment: async (_id, { deleteComment }, { userId, emailId }) => {
      if (userId && emailId) {
        const user = await User.findOne({ userId: userId });
        if (user) {
          const commentsByUser = await Post.findOneAndUpdate(
            { _id: deleteComment?.postId },
            {
              $pull: {
                comments: { _id: deleteComment?.commentId, userId: userId },
              },
            },
            { returnNewDocument: true }
          );
          return commentsByUser;
        }
      } else {
        throw new Error("not authorise");
      }
    },
  },
};

export default PostResolvers;

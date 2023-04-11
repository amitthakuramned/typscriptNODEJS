import gql from "graphql-tag";

const PostTypeDefs = gql`
  type Query {
    posts: [Post]
    post(_id: ID): Post
    comments: [Comments]
    comment(_id: ID): Comments
    likes: [Likes]
    like(_id: ID): Likes
  }

  type Mutation {
    createPost(newPost: CreatePostInput!): Post
    createComment(newComent: CreateCommentInput!): Post
    createLike(newLike: CreateLikeInput!): Post
    deleteComment(deleteComment: DeleteCommentInput!): Post
    deletePost(deletePost: DeletePostInput!): Post
  }

  type Post {
    _id: ID!
    userId: String
    description: String
    img: String
    likes: [Likes]
    comments: [Comments]
  }

  type Comments {
    _id: ID!
    userId: String!
    description: String!
    img: String!
  }

  type Likes {
    _id: ID!
    userId: String!
    likeType: String!
  }

  input CreatePostInput {
    userId: String!
    description: String!
    img: String!
  }

  input CreateCommentInput {
    postId: String!
    description: String
    img: String
  }

  input CreateLikeInput {
    postId: String!
    likeType: String!
  }

  input DeletePostInput {
    postId: String!
  }

  input DeleteCommentInput {
    postId: String!
    commentId: String!
  }
`;

export default PostTypeDefs;

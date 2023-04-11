import gql from "graphql-tag";

const UserTypeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID): User
    LogedUser(userEmail: String!): LoginUser
  }

  type Mutation {
    createUser(userNew: UserInput!): User
    loginUser(userLogin: LoginUserInput!): Token
  }

  type Sucessfull{
    message:String
  }

  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    city: String
    state: String
    country: String
    contact: String
    role: String
    address: String
    streetAddress1: String
    streetAddress2: String
    pinCode: String!
    profession: String!
    service: String!
    organisation: String!
    bussiness: String!
    message: String
  }

  type LoginUser {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    city: String
    state: String
    country: String
    contact: String
    role: String
    address: String
    streetAddress1: String
    streetAddress2: String
    pinCode: String
    profession: String
    service: String
    organisation: String
    bussiness: String
    message: String
  }

  type Token {
    token: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    city: String!
    state: String!
    country: String!
    contact: String!
    role: String!
    address: String!
    streetAddress1: String
    streetAddress2: String
    pinCode: String!
    profession: String!
    service: String!
    organisation: String!
    bussiness: String!
    message: String
  }

  input LoginUserInput {
    email: String!
    password: String!
  }
`;

export default UserTypeDefs;

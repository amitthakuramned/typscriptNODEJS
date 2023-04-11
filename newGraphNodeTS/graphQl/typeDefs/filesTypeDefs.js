import gql from "graphql-tag";

const FileTypeDefs = gql`
  scalar Upload

  type Mutation {
    uploadFile(file: Upload!): Sucessfull
  }

  type File {
    id: ID!
    filename: String!
    mimetype: String!
    path: String!
  }

  type Sucessfull{
    message:String
  }
`;

export default FileTypeDefs;

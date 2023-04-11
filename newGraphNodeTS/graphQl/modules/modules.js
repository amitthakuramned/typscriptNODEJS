import { createModule } from 'graphql-modules';
import UserTypeDefs from "../typeDefs/userTypeDefs.js";
import UserResolvers from "../resolvers/userResolver.js";
import PostTypeDefs from "../typeDefs/postTypeDefs.js";
import PostResolvers from "../resolvers/postResovlers.js";
import FileTypeDefs from "../typeDefs/filesTypeDefs.js";
import FileResolvers from "../resolvers/filesResolver.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge }from "lodash";

export const UserModule = createModule({
  id: 'user-module',
  dirname: 'usertypedefs',
  typeDefs: [UserTypeDefs],
  resolvers: [UserResolvers]
});

export const PostModule = createModule({
    id: 'Post-module',
    dirname: 'PostTypeDefs',
    typeDefs: [PostTypeDefs],
    resolvers: [PostResolvers]
  });

  export const FileModule = createModule({
    id: 'File-module',
    dirname: 'FileTypeDefs',
    typeDefs: [FileTypeDefs],
    resolvers: [FileResolvers]
  });

  //makeExecutableSchema
  export const schema = makeExecutableSchema({
    typeDefs: [UserTypeDefs,PostTypeDefs,FileTypeDefs],
    resolvers: merge(UserResolvers,PostResolvers,FileResolvers)
  });
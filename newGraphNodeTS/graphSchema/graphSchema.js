import { createApplication } from 'graphql-modules';
import { UserModule,PostModule,FileModule} from '../graphQl/modules/modules.js';
import { makeExecutableSchema } from "@graphql-tools/schema";

export const application = createApplication({
  modules: [UserModule, PostModule,FileModule],
});
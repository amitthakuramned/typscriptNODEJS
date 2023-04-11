import express from "express";
import "./modelSchema/modelsSchema.js";
import { createServer } from "http";
import { application } from "./graphSchema/graphSchema.js";
import { JWT_SECRET } from "./api/controllers/common/constants.js";
import { PubSub } from "graphql-subscriptions";
import gql from "graphql-tag";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { connectWithDB } from "./db/db.js";
import http from "http";
import jwt from "jsonwebtoken";
import { schema } from "./graphQl/modules/modules.js";

const app = express();
const httpServer = http.createServer(app);

(async function () {
  // conect with db
  connectWithDB();
  // Server code in here!
  const pubsub = new PubSub(); // Publish and Subscribe, Publish -> everyone gets to hear it
  const app = express();
  const httpServer = createServer(app);

  // ws socket Server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql", // localhost:3000/graphql
  });

  const serverCleanup = useServer({ schema }, wsServer); // dispose

  // apollo server
  //@ts-ignore
  const server: any = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // start our server
  await server.start();

  // apply middlewares (cors, expressmiddlewares)
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      // @ts-ignore
      context: ({ req }) => {
        const { authorization } = req.headers;
        if (authorization) {
          //@ts-ignore
          const { userId, emailId } = jwt.verify(authorization, JWT_SECRET);
          return { userId, emailId };
        }
      },
    })
  );

  // http server start
  httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:" + "4000" + "/graphql");
  });
})();

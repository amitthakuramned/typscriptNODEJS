"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const graphSchema_js_1 = require("./graphSchema/graphSchema.js");
const constants_js_1 = require("./api/controllers/common/constants.js");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const schema_1 = require("@graphql-tools/schema");
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_js_1 = require("./db/db.js");
const http_2 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const httpServer = http_2.default.createServer(app);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // conect with db
        (0, db_js_1.connectWithDB)();
        // Server code in here!
        const pubsub = new graphql_subscriptions_1.PubSub(); // Publish and Subscribe, Publish -> everyone gets to hear it
        const app = (0, express_1.default)();
        const httpServer = (0, http_1.createServer)(app);
        // GraphQL Typedefs and resolvers
        const typeDefs = (0, graphql_tag_1.default) `
    type NewsEvent {
      title: String
      description: String
    }

    type Query {
      placeholder: Boolean
    }

    type Mutation {
      createNewsEvent(title: String, description: String): NewsEvent
    }

    type Subscription {
      newsFeed: NewsEvent
    }
  `;
        const resolvers = {
            Query: {
                placeholder: () => {
                    return true;
                },
            },
            Mutation: {
                createNewsEvent: (_parent, args) => {
                    console.log(args);
                    pubsub.publish("EVENT_CREATED", { newsFeed: args });
                    // Save news events to a database: you can do that here!
                    // Create something : EVENT_CREATED
                    // Subscribe to something: EVENT_CREATED
                    return args;
                },
            },
            Subscription: {
                newsFeed: {
                    subscribe: () => pubsub.asyncIterator(["EVENT_CREATED"]),
                },
            },
        };
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
        const schema2 = graphSchema_js_1.application.createSchemaForApollo();
        // ws Server
        const wsServer = new ws_1.WebSocketServer({
            server: httpServer,
            path: "/graphql", // localhost:3000/graphql
        });
        const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer); // dispose
        // apollo server
        //@ts-ignore
        const server = new server_1.ApolloServer({
            schema,
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
            ],
        });
        // start our server
        yield server.start();
        // apply middlewares (cors, expressmiddlewares)
        app.use("/graphql", (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
            // @ts-ignore
            context: ({ req }) => {
                const { authorization } = req.headers;
                if (authorization) {
                    const { userId, emailId } = jsonwebtoken_1.default.verify(authorization, constants_js_1.JWT_SECRET);
                    return { userId, emailId };
                }
            },
        }));
        // http server start
        httpServer.listen(4000, () => {
            console.log("Server running on http://localhost:" + "4000" + "/graphql");
        });
    });
})();

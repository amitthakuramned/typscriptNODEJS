import mongoose from "mongoose";
import { JWT_SECRET, MONGO_URL } from "../api/controllers/common/constants.js";

export const connectWithDB = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(MONGO_URL);

  mongoose.connection.on("connected", () => {
    console.log("connected to mongo db");
  });
  mongoose.connection.on("error", () => {
    console.log("error connecting", err);
  });
};

import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    mongoose
      .connect(config.MONGO_URI!)
      .then(() => {
        console.log("MongoDB connected successfully.");
      })
      .catch(() => {
        console.log("MongoDB connection failed.");
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
  mongoose.connection.on("error", connect);
};

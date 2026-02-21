import mongoose from "mongoose";
import { config } from "./index";

export const connectDb = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri as string);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

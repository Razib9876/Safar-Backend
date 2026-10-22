// import mongoose from "mongoose";
// import { config } from "./index";

// export const connectDb = async (): Promise<void> => {
//   try {
//     const conn = await mongoose.connect(config.mongodbUri as string);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

import dns from "dns";
import mongoose from "mongoose";
import { config } from "./index";

// বাংলাদেশের ISP এর DNS এ SRV lookup এর সমস্যা এড়াতে
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDb = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri as string);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

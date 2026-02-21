import app from "./app";
import { config } from "./config";
import { connectDb } from "./config/db";

const start = async (): Promise<void> => {
  await connectDb();
  app.listen(config.port, () => {});
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

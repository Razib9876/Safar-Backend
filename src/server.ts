import app from "./app";
import { config } from "./config";
import { connectDb } from "./config/db";

const start = async (): Promise<void> => {
  try {
    await connectDb();
    console.log("✅ Database connected");

    const PORT = process.env.PORT || config.port || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();

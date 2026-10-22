import serverless from "serverless-http";
import mongoose from "mongoose";
import app from "../../src/app";
import { config } from "../../src/config/index";

const serverlessApp = serverless(app, {
  basePath: "/.netlify/functions/api",
});

let dbPromise: Promise<typeof mongoose> | null = null;

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!dbPromise) {
    dbPromise = mongoose.connect(config.mongodbUri as string);
  }
  await dbPromise;

  return serverlessApp(event, context);
};

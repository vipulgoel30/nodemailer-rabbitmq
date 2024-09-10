// Third party imports
import { createClient } from "redis";

// User import
import errorLogger from "./utils/errorLogger.js";

const client = createClient({
  url: process.env.REDIS_URL,
});

const initClient = async (): Promise<void> => {
  try {
    await client.connect();
    console.log("Redis connected successfully 😎 😎 😎");
  } catch (err) {
    errorLogger(err as Error, "Error in redis connection", true);
  }
};

initClient();

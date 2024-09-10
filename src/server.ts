// Third party imports
import { connect } from "mongoose";

// User imports
import retryAsync, { INFINITE } from "./utils/retryAsync.js";
import app from "./app.js";
import errorLogger from "./utils/errorLogger.js";
import initAssets from "./utils/initAssets.js";
import initRabbitMq from "./utils/rabbitmq.js";

const errTypes = ["uncaughtException", "unhandledRejection"] as const;
errTypes.forEach((errType: (typeof errTypes)[number]) => {
  process.on(errType, (err: Error) => {
    errorLogger(err, `${errType.toUpperCase()} !!!`);

    process.exitCode = 0;
  });
});

const initServer = async () => {
  try {
    if (!process.env.MONGO_CONN) throw new Error("Environment variable MONGO_CONN is not available");

    // Mongo Connection init
    await retryAsync(() => connect(process.env.MONGO_CONN), INFINITE, 2, 10);
    console.log("MongoDB connected successfully ✅ ✅ ✅");

    // Express app init
    const port: number = parseInt(process.env.PORT ?? "4000");
    app.listen(port, () => {
      console.log(`App running on port : ${port} ✌️ ✌️ ✌️`);
    });

    initAssets();
    initRabbitMq();
  } catch (err) {
    if (err instanceof Error) {
      errorLogger(err, true);
    }
  }
};

initServer();

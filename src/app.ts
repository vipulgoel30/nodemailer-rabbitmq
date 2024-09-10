// Third party imports
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// User imports
import clientRouter from "./routes/clientRouter.js";
import globalErrController from "./controllers/globalErrController.js";
import { getStorage, initStorage } from "./utils/storage.js";
import { createNotFoundError, InternalServerError } from "./utils/AppError.js";

const app: Express = express();

// morgan : logging middleware
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

// Checking if the megajs storage is available or not
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!getStorage()) {
    next(InternalServerError);
    return initStorage();
  }

  return next();
});

// parse the incoming payload if the content-type : application/json
app.use(express.json());

// cors : cross origin resource sharing
app.use(cors({ origin: ["*"] }));

// helmet : add security headers to response
app.use(helmet());

// express-mongo-sanitize : sanitize the incoming payload for the mongo specific query
app.use(mongoSanitize());

// express-rate-limit : limits the number of request from specific IP address
app.use(rateLimit({ limit: 10, windowMs: 60000 }));

app.use("/api/v1/client", clientRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(createNotFoundError(`We don't handle this route ${req.method} : ${req.originalUrl}`));
});

app.use(globalErrController);

export default app;

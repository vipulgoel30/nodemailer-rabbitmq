// Third party imports
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// User imports
import AppError, { DEFAULT_ERR_MESSAGE } from "../utils/AppError.js";

type ResData = {
  statusCode: number;
  message: string | string[];
};

const handleZodError = (err: ZodError) => {
  return {
    statusCode: 400,
    message: err.errors.map((error) => error.message),
  };
};

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "dev") console.log("Here", err);

  let message: string | string[] = DEFAULT_ERR_MESSAGE;
  let statusCode: number = 500;

  if (err instanceof AppError) {
    ({ message, statusCode } = err);
  } else if (err instanceof ZodError) {
    ({ message, statusCode } = handleZodError(err));
  }
  res.status(statusCode).json({
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message,
  });
};

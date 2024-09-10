// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import catchAsync from "../utils/catchAsync.js";
import { authorizationHeaderSchema } from "../lib/zod/routes/auth.js";
import { createForbiddenError } from "../utils/AppError.js";

export const authorize = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // validating token against the schema
  const authToken: string = await authorizationHeaderSchema.parseAsync(req.headers.authorization?.slice(7));

  // comparing token against the SECRET
  if (process.env.SECRET !== authToken) {
    next(createForbiddenError("Invalid authorization header token"));
  }

  next();
});

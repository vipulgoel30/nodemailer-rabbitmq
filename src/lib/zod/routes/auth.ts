// User imports
import { authorizationHeaderErrMsgs } from "../../errors/auth.js";
import createStringSchema from "../utils.js";

export const authorizationHeaderSchema = createStringSchema(authorizationHeaderErrMsgs).length(
  60,
  "Invalid length of the authorization header"
);

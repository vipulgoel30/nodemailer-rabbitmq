// User imports
import { createFieldErrMsgs } from "./utils.js";

export const authorizationHeaderErrMsgs = createFieldErrMsgs({
  field: "Authorization Header",
  required: true,
  expectedType: "string",
  format: "Invalid length of the authorization header",
});

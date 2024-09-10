// User imports
import { keyErrMsgs, nameErrMsgs } from "../../errors/client.js";
import createStringZodSchema from "../utils.js";

export const nameSchema = createStringZodSchema(nameErrMsgs);

export const keySchema = createStringZodSchema(keyErrMsgs).length(36, "Invalid length for the key");

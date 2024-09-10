// Third party imports
import { z, ZodString } from "zod";

// User imports
import { FieldErrMsgs } from "../errors/utils.js";

const createStringSchema = (fieldErrMsgs: FieldErrMsgs): ZodString => {
  const { requiredErr, invalidTypeErr, minLengthErr, maxLengthErr } = fieldErrMsgs;

  const zodString: ZodString = z.string({
    ...(requiredErr && { required_error: requiredErr }),
    ...(invalidTypeErr && { invalid_type_error: invalidTypeErr }),
  });

  if (minLengthErr) zodString.min(minLengthErr.length, minLengthErr.message);
  if (maxLengthErr) zodString.max(maxLengthErr.length, maxLengthErr.message);

  return zodString;
};

export default createStringSchema;

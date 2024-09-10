// User imports
import { createFieldErrMsgs, FieldErrMsgs } from "./utils.js";

export const nameErrMsgs: FieldErrMsgs = createFieldErrMsgs({
  field: "name",
  required: true,
  minLength: 1,
  maxLength: 50,
  expectedType: "string",
});

export const logoUrlErrMsgs: FieldErrMsgs = createFieldErrMsgs({
  field: 'logo url',
  required:true
})

export const keyErrMsgs: FieldErrMsgs = createFieldErrMsgs({
  field: "key",
  required: true,
  expectedType: "string",
  format: "Invalid length for the key",
});

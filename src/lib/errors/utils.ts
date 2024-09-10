// User imports
import { StringObj } from "../../../types.js";

export const createRequiredErr = (field: string): string => `Missing required field : ${field}`;

export const createMinLengthErr = (field: string, minLength: number): string =>
  `${field} is too short. Expected length of ${minLength} or more chars.`;

export const createMaxLengthErr = (field: string, maxLength: number): string =>
  `${field} is too long. Expected length of maximum ${maxLength} chars.`;

export const createInvalidTypeErr = (field: string, expectedType: string = "string"): string =>
  `Unexpected type for ${field}. Expected a ${expectedType}`;

interface CreateFieldErrMsgOptions {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  expectedType?: string;
  format?: string;
}

export interface FieldErrMsgs {
  requiredErr?: string;
  invalidTypeErr?: string;
  minLengthErr?: { message: string; length: number };
  maxLengthErr?: { message: string; length: number };
  formatErr?: string;
}

export const createFieldErrMsgs = ({
  field,
  required,
  minLength,
  maxLength,
  expectedType,
  format,
}: CreateFieldErrMsgOptions): FieldErrMsgs => ({
  ...(required && { requiredErr: createRequiredErr(field) }),
  ...(minLength && {
    minLengthErr: {
      message: createMinLengthErr(field, minLength),
      length: minLength,
    },
  }),
  ...(maxLength && {
    maxLengthErr: {
      message: createMaxLengthErr(field, maxLength),
      length: maxLength,
    },
  }),
  ...(expectedType && { invalidTypeErr: createInvalidTypeErr(field, expectedType) }),
  ...(format && { formatErr: format }),
});

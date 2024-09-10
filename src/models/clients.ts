// Third party imports
import { HydratedDocument, HydratedSingleSubdocument, model, Schema } from "mongoose";

// User imports
import { keyErrMsgs, logoUrlErrMsgs, nameErrMsgs } from "../lib/errors/client.js";

const clientSchema = new Schema(
  <const>{
    name: {
      type: String,
      required: [true, nameErrMsgs.requiredErr!],
      trim: true,
    },
    logoURL: {
      type: String,
      required: [true, logoUrlErrMsgs.requiredErr!],
      trim: true,
    },
    key: {
      type: String,
      required: [true, keyErrMsgs.requiredErr!],
      unique: true,
    },
  },
  {
    __v: false,
    timestamps: true,
  }
);

const Client = model("Clients", clientSchema);

export type ClientI = HydratedDocument<{
  name: string;
  logoURL: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export default Client;

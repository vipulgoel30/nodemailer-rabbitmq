// Core imports
import { randomUUID } from "crypto";

// User imports
import { encrypter } from "./encryptDecrypt.js";

export interface KeyObj {
  key: string;
  encryptedKey: string;
}

const generateKey = (): KeyObj => {
  const key: string = randomUUID();
  const encryptedKey: string = encrypter(key, "utf-8", "hex")!;
  return { key, encryptedKey };
};

export default generateKey;

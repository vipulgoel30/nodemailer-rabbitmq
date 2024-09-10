// Core imports
import { Cipher, createCipheriv, createDecipheriv, Decipher, Encoding } from "crypto";

const algorithm: string = "aes-256-cbc";
const CRYPTO_INIT_VECTOR = Buffer.from(process.env.CRYPTO_INIT_VECTOR!, "hex");
const CRYPTO_KEY = Buffer.from(process.env.CRYPTO_KEY!, "hex");

// Defination for the encrypter and decrypter function
interface CryptoFn {
  (payload: string, inputEncoding?: Encoding, outputEncoding?: Encoding): string | null;
}

export const encrypter: CryptoFn = (payload, inputEncoding = "utf-8", outputEncoding = "hex") => {
  try {
    const cipher: Cipher = createCipheriv(algorithm, CRYPTO_KEY, CRYPTO_INIT_VECTOR);
    let encryptedData: string = cipher.update(payload, inputEncoding, outputEncoding);
    return (encryptedData += cipher.final(outputEncoding));
  } catch (err) {
    return null;
  }
};

export const decrypter: CryptoFn = (payload, inputEncoding = "hex", outputEncoding = "utf-8") => {
  try {
    const decipher: Decipher = createDecipheriv(algorithm, CRYPTO_KEY, CRYPTO_INIT_VECTOR);
    let decryptedData: string = decipher.update(payload, inputEncoding, outputEncoding);
    return (decryptedData += decipher.final(outputEncoding));
  } catch (err) {
    return null;
  }
};

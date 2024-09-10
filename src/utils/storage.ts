// Core imports
import { createReadStream, ReadStream } from "fs";

// Third party imports
import { File, MutableFile, Storage, UploadStream } from "megajs";

// User imports
import retryAsync, { INFINITE } from "./retryAsync.js";
import errorLogger from "./errorLogger.js";

let storage: Storage | undefined = undefined;
let isStorageInitializing: boolean = true;

export const getStorage = (): Storage | undefined => storage;

export const initStorage = async () => {
  isStorageInitializing = true;
  storage = undefined;
  try {
    storage = await retryAsync<Storage>(
      () =>
        new Storage({
          email: process.env.MEGA_EMAIL,
          password: process.env.MEGA_PASSWORD,
          userAgent: "nodemailer-rabbitmq/1.0",
          keepalive: true,
        }).ready,
      INFINITE,
      1,
      10
    );
    console.log("Mega storage initialization successfull. 🎉 🎉 🎉");
  } catch (err) {
    if (err instanceof Error) {
      let message: string = "Issue in initializing mega storage";

      if (err.message === "EARGS (-2): You have passed invalid arguments to this command.") {
        message = "Invalid credentials while initializing mega storage";
      }

      errorLogger(err as Error, message, true);
    }
  }
  isStorageInitializing = false;
};

initStorage();

export const storageOperations = async <Type = any>(operation: () => Promise<Type>): Promise<Type> => {
  return retryAsync(
    async () => {
      // Checking if the storage object exists or not
      if (!storage) throw new Error("Storage is uninitialized");
      return await operation();
    },
    5,
    100,
    500,
    async () => {
      // if storage does not exist and it is not in initializing state
      if (!storage && !isStorageInitializing) await initStorage();
    }
  );
};

export const upload = async (name: string, size: number, path: string): Promise<string | null> => {
  try {
    return await storageOperations(async () => {
      const fileStream: ReadStream = createReadStream(path);
      const uploadStream: UploadStream = storage!.upload({ name, size });
      fileStream.pipe(uploadStream);

      const file: MutableFile = await uploadStream.complete;
      const link: string = await file.link({});
      return link;
    });
  } catch (err) {
    return null;
  }
};

export const deleteFile = async (url: string) => {
  try {
    await storageOperations(async () => {
      const fileFromUrl = File.fromURL(url);
      await fileFromUrl.loadAttributes();
      await storage?.root.children?.find((file) => file.name === fileFromUrl.name)?.delete();
      process.env.NODE_ENV === "dev" && console.log("File deleted successfully from mega");
    });
  } catch (err) {}
};

// Core imports
import { createWriteStream, WriteStream } from "fs";
import { Readable } from "stream";

// Third party imports
import { MutableFile, Storage } from "megajs";

// User imports
import { getStorage } from "./storage.js";
import errorLogger from "./errorLogger.js";

const initAssets = () => {
  const timeout: NodeJS.Timeout = setInterval(async () => {
    // Checking if the storage is available or not
    const storage: Storage | undefined = getStorage();

    if (storage) {
      try {
        // Getting all the files from the storage object
        const files: MutableFile[] | undefined = storage.root.children;
        files?.forEach(async (file: MutableFile) => {
          // Downloading files
          const fileStream: WriteStream = createWriteStream(`./assets/${file.name}`);
          const downloadStream: Readable = file.download({});

          // readStream.pipe(writeStream)
          downloadStream.pipe(fileStream);
        });

        // Clearing setInterval
        clearTimeout(timeout);
      } catch (err) {
        errorLogger(err as Error, "Issue in initing assets", true);
      }
    }
  }, 500);
};

export default initAssets;

// Core imports
import { unlink } from "fs";
import { promisify } from "util";

// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import Client, { ClientI } from "../models/clients.js";
import catchAsync from "../utils/catchAsync.js";
import retryAsync from "../utils/retryAsync.js";
import generateKey, { KeyObj } from "../utils/key.js";
import { keySchema, nameSchema } from "../lib/zod/routes/client.js";
import { deleteFile, upload } from "../utils/storage.js";
import { createBadRequestError, InternalServerError } from "../utils/AppError.js";
import { encrypter } from "../utils/encryptDecrypt.js";

// ***********************************
// Helper Functions
// ***********************************

const fileUploadHelper = async (file: Express.Multer.File): Promise<string> => {
  const path: string = `./uploads/${file.filename!}`;

  // Uploading the file to mega
  const link: string | null = await upload(file.filename!, file.size!, path);
  if (!link) throw InternalServerError;

  // deleting the file from the local directory
  retryAsync(() => promisify(unlink)(path), 3, 50, 100)
    .then(() => process.env.NODE_ENV === "dev" && console.log("File deleted successfully from local directory"))
    .catch((err) => process.env.NODE_ENV === "dev" && console.log(err));

  return link;
};

// ***********************************
// Request Handlers
// ***********************************
export const populateClientByKey = catchAsync(
  async (req: Request<{ key?: string }>, res: Response, next: NextFunction) => {
    // checking the key against the schema
    const key: string = await keySchema.parseAsync(req.params?.key);

    // encrypting the key to fetch data corresponding to key
    const encryptedKey: string | null = encrypter(key, "utf-8", "hex");
    if (!encryptedKey) return next(createBadRequestError("Invalid key for the client"));

    // getting the client based on the key
    const client = await retryAsync(
      () => Client.findOne({ key: encryptedKey }).select("-__v  -createdAt -updatedAt"),
      3,
      50,
      100
    );
    if (!client) return next(createBadRequestError("Invalid Key for the client"));

    req.body.client = client;
    next();
  }
);

// ***********************************
// Request Handlers (Middlewares)
// ***********************************

//? Creating Client
export const createClient = catchAsync(
  async (req: Request<{}, {}, { name: string }>, res: Response, next: NextFunction) => {
    // Parsing name against the schema
    const name: string = await nameSchema.parseAsync(req.body.name);

    // Checking if whether the file is uploaded on the server or not
    if (!req.file) return next(createBadRequestError("Failed to locate the uploaded image on the server."));

    // Generating the key
    const { key, encryptedKey }: KeyObj = generateKey();

    // Sending the response
    res.status(201).json({
      status: "sucess",
      message: "Client created successfully",
      payload: { name, key },
    });

    // Uploading file to mega
    const link: string = await fileUploadHelper(req.file);

    // Creating the client
    await retryAsync(() => Client.create({ name, logoURL: link, key: encryptedKey }), 3, 10, 50);
  }
);

//? Updating Client
export const updateClient = catchAsync(
  async (req: Request<{ key?: string }, {}, { name?: string; client: ClientI }>, res: Response, next: NextFunction) => {
    const { client } = req.body;

    if (req.body.name) {
      const name = await nameSchema.parseAsync(req.body.name);
      client.name = name;
    }

    res.status(200).json({
      status: "success",
      message: "Client updated successfully",
    });

    if (req.file) {
      const link: string = await fileUploadHelper(req.file);
      client.logoURL = link;
      await retryAsync(() => deleteFile(client.logoURL), 3, 100, 500);
    }

    await client.save();
  }
);

// ? Get Client By Key
export const getClient = (req: Request<{}, {}, { client: ClientI }>, res: Response, next: NextFunction): void => {
  res.status(200).json({
    status: "success",
    message: "Client fetched successfully",
    payload: req.body.client,
  });
};

// ? Delete client By Key
export const deleteClient = catchAsync(
  async (req: Request<{}, {}, { client: ClientI }>, res: Response, next: NextFunction) => {
    const { client } = req.body;
    res.status(204).json({});
    await retryAsync(() => deleteFile(client.logoURL), 3, 100, 500);
    await retryAsync(() => Client.deleteOne({ _id: client._id }), 5, 10, 30);
  }
);

//? By default limit 20 and page 1
export const getClients = catchAsync(
  async (req: Request<{}, {}, {}, { limit?: number; page?: number }>, res: Response, next: NextFunction) => {
    const page: number = req.query.page ?? 1;
    const limit: number = req.query.limit ?? 20;
    const skip: number = (page - 1) * limit;

    const clients = await Client.find().select("-__v -createdAt -updatedAt -_id").skip(skip).limit(limit).lean();

    res.status(200).json({
      status: "success",
      length: clients.length,
      payload: { clients },
    });
  }
);

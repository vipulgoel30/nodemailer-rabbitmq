// Third party imports
import { Router } from "express";

// User imports
import upload from "../utils/multer.js";
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  populateClientByKey,
  updateClient,
} from "../controllers/clientController.js";
import { authorize } from "../controllers/authController.js";

const router = Router();

router.use(authorize);

router.get("/all", getClients);
router.get("/:key", populateClientByKey, getClient);
router.post("/create", upload.single("logo"), createClient);
router.patch("/update/:key", upload.single("logo"), populateClientByKey, updateClient);
router.delete("/:key", populateClientByKey, deleteClient);

export default router;

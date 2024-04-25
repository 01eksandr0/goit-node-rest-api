import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { validateContact } from "./middlewareValidate.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateContact(updateContactSchema), createContact);

contactsRouter.put("/:id", validateContact(updateContactSchema), updateContact);

export default contactsRouter;

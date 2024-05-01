import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import { validateContact } from "./middlewareValidate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { validateContactsId } from "./validateContactsId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateContactsId, getOneContact);

contactsRouter.delete("/:id", validateContactsId, deleteContact);

contactsRouter.post("/", validateContact(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  validateContactsId,
  validateContact(updateContactSchema),
  updateContact
);

contactsRouter.put(
  "/:id/favorite",
  validateContactsId,
  validateContact(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;

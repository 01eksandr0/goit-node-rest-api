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
import { authenticate } from "./authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, validateContactsId, getOneContact);

contactsRouter.delete("/:id", authenticate, validateContactsId, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateContact(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateContactsId,
  validateContact(updateContactSchema),
  updateContact
);

contactsRouter.put(
  "/:id/favorite",
  authenticate,
  validateContactsId,
  validateContact(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;

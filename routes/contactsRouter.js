import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.use((req, res, next) => {
  const { name, email, phone } = req.query;
  if (!name && !email && !phone)
    res.status(400).json({ message: "Body must have at least one field" });
  next();
});

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

export default contactsRouter;

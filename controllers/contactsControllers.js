import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";
export const getAllContacts = async (req, res) => {
  res.json(await contactsService.listContacts());
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id.slice(1));
  console.log(contact);
  if (contact) res.json(contact);
  else res.status(404).json({ message: HttpError(404).message });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id.slice(1));
  console.log(contact);
  if (contact) res.json(contact);
  else res.status(404).json({ message: HttpError(404).message });
};

export const createContact = async (req, res) => {
  const query = req.query;
  const schema = createContactSchema.validate(query);
  if (schema.error) {
    res.status(400).json({ message: schema.error.details[0].message });
  } else {
    const { name, email, phone } = query;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  }
};

export const updateContact = async (req, res) => {
  const query = req.query;
  const schema = updateContactSchema.validate(query);
  if (schema.error) {
    res.status(400).json({ message: schema.error.details[0].message });
  } else {
    const { id } = req.params;
    const contact = await contactsService.updateContact(id.slice(1), query);
    if (contact) {
      res.json(contact);
    } else res.status(404).json({ message: HttpError(404).message });
  }
};

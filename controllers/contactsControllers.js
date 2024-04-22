import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";
export const getAllContacts = async (req, res) => {
  res.json(await contactsService.listContacts());
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id.slice(1));
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id.slice(1));
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const query = req.query;
    const schema = createContactSchema.validate(query);
    if (schema.error) {
      throw HttpError(400, schema.error.details[0].message);
    }
    const { name, email, phone } = query;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const query = req.query;
    const schema = updateContactSchema.validate(query);
    if (schema.error) {
      throw HttpError(400, schema.error.details[0].message);
    }
    const { id } = req.params;
    const contact = await contactsService.updateContact(id.slice(1), query);
    if (!contact) throw HttpError(404);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

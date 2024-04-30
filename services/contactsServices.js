import { Contact } from "../models/contact.js";

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
};

const removeContact = async (id) => {
  return Contact.findOneAndDelete({ _id: id });
};

const addContact = async (name, email, phone) => {
  return Contact.create({ name, email, phone });
};

const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate({ _id: id }, data, { new: true });
};
const updateStatusContact = async (id, status) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { favorite: status },
    { new: true }
  );
};
export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

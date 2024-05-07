import { Contact } from "../models/contact.js";

const listContacts = async (owner, skip, limit) => {
  return Contact.find({ owner }, "", { skip, limit });
};

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
};

const removeContact = async (id) => {
  return Contact.findOneAndDelete({ _id: id });
};

const addContact = async (body) => {
  return Contact.create(body);
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

import fs from "fs/promises";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const list = await listContacts();
  return list.find((i) => i.id === id) || null;
};

const removeContact = async (id) => {
  const list = await listContacts();
  const index = list.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const item = list.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2), "utf-8");
  return item;
};

const addContact = async (name, email, phone) => {
  const data = await listContacts();
  const item = { id: nanoid(), name, email, phone };
  await fs.writeFile(
    contactsPath,
    JSON.stringify([...data, item], null, 2),
    "utf-8"
  );
  return item;
};

const updateContact = async (id, data) => {
  const list = await listContacts();
  const index = list.findIndex((i) => i.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2), "utf-8");
  return list[index];
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

import { nanoid } from "nanoid";
import path from "node:path";
import * as fs from "node:fs/promises";

const contactsPath = path.resolve("db", "contacts.json");

 async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
      throw error;
  }
}

 async function getContactById(contactId) {
  try {
        const contacts = await listContacts();
        return contacts.find(contact => contact.id === contactId) || null;
    } catch (error) {
        throw error;
    }
}


 async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);

    if (index === -1) {
      return null;
    } else {
      const removedContact = contacts.splice(index, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return removedContact;
    }
  } catch (error) {
    throw error;
  }
}

 async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const id = nanoid();
    const newContact = { id, name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw error;
  }
  
}

async function updateContact(id, data) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      return null;
    }
    
    contacts[index] = { ...contacts[index], ...data };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    throw error;
  }
}

export default { listContacts, getContactById, removeContact, addContact, updateContact };
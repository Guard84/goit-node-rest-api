import contactsService from "../services/contactsServices.js";
const { listContacts, getContactById, removeContact, addContact, updateContact } = contactsService;
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";


export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ "message": "Internal server error" });
  }
  
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ "message": "Not found" });
    }
  } catch (error) {
    res.status(500).json({ "message": "Internal server error" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await removeContact(id)

    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ "message": "Not found" });
    }
  } catch (error) {
     res.status(500).json({ "message": "Internal server error" });
  }
};

export const createContact = async (req, res) => {
  try {
    validateBody(createContactSchema)(req, res, async () => {
      const { name, email, phone } = await req.body;
      const newContact = await addContact(name, email, phone);
      res.status(201).json(newContact);
    });
  } catch (error) {
    res.status(500).json({ "message": "Internal server error" });
  }
};

export const changeContact = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const existingContact = await getContactById(id);
    if (!existingContact) {
      return res.status(404).json({ "message": "Not found" });
    }

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ "message": "Body must have at least one field" });
    }

    if (res.headersSent) {
      return;
    }

    validateBody(updateContactSchema)(req, res, async () => {
      const updatedContact = await updateContact(id, body);
      res.status(200).json(updatedContact);
    });
  } catch (error) {
    res.status(500).json({ "message": "Internal server error" });
  }
}



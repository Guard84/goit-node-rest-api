import express from "express";
import ContactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", ContactsControllers.getAllContacts);

contactsRouter.get("/:id", ContactsControllers.getOneContact);

contactsRouter.delete("/:id", ContactsControllers.deleteContact);

contactsRouter.post(
  "/",
  jsonParser,
  validateBody(createContactSchema),
  ContactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  jsonParser,
  validateBody(updateContactSchema),
  ContactsControllers.changeContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  jsonParser,
  ContactsControllers.updateStatusContact
);

export default contactsRouter;

import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", changeContact);

export default contactsRouter;

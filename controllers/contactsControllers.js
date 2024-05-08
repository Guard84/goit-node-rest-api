import Contact from "../models/contact.js";

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (contact === null) {
      res.status(404).send({ message: "Not found" });
    } else {
      res.status(200).send(contact);
    }
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (deletedContact === null) {
      res.status(404).send({ message: "Not found" });
    } else {
      res.status(200).send(deletedContact);
    }
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const newContact = await Contact.create(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

const changeContact = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    if (!body.name && !body.email && !body.phone) {
      return res
        .status(400)
        .send({ message: "Body must have at least one field" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (updatedContact === null) {
      return res.status(404).send({ message: "Contact not found" });
    } else {
      res.status(200).send(updatedContact);
    }
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (updatedContact === null) {
      return res.status(404).send({ message: "Not found" });
    } else {
      res.status(200).send(updatedContact);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  updateStatusContact,
};

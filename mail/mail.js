import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "tankian84@meta.ua",
    pass: process.env.META_PASSWORD,
  },
});

const message = {
  from: "tankian84@meta.ua",
  to: "guardsofword@gmail.com",
  subject: "Nodemailer test",
  text: "Привіт. Я тестую надсилання листів!",
};

transporter
  .sendMail(message)
  .then((info) => console.log(info))
  .catch((err) => console.log(err));

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


function sendMail(message) {
    return transporter.sendMail(message)
};

export default { sendMail };

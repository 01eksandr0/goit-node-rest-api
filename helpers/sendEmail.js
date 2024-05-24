import sgMail from "@sendgrid/mail";
import { configDotenv } from "dotenv";
configDotenv();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (data) => {
  const email = { ...data, from: "kraleksandr344@gmail.com" };
  await sgMail.send(email);
  return true;
};

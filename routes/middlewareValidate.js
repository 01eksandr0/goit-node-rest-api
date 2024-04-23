import { updateContactSchema } from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const validateContact = (req, res, next) => {
  try {
    const query = req.query;
    const schema = updateContactSchema.validate(query);
    if (schema.error) {
      throw HttpError(400, "Body must have at least one field");
    } else next();
  } catch (error) {
    next(error);
  }
};

import HttpError from "../helpers/HttpError.js";

export const validateContact = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      } else next();
    } catch (error) {
      next(error);
    }
  };
};

import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .min(3),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(1).max(20).optional(),
  email: Joi.string()
    .min(3)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string()
    .optional()
    .pattern(/^[0-9]{10}$/),
  favorite: Joi.boolean().optional(),
})
  .min(1)
  .message("Body must have at least one field");

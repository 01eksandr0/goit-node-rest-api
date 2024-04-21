import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string()
    .optional()
    .pattern(/^[0-9]{10}$/),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string()
    .optional()
    .optional()
    .pattern(/^[0-9]{10}$/),
});

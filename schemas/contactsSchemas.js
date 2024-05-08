import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(5),
})

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(5),
});



// export const validateId = (req, res, next) => {
//   const idSchema = Joi.string().min(24).required();
//   const { error } = idSchema.validate(req.params.id);
//   if (error) {
//     return res.status(400).json({ message: "Invalid id" });
//   }
//   next();
// };
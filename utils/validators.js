import { body, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation in validations) {
      const result = await validations[validation].run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ erros: errors.array() });
  };
};

export const loginValidator = [
  body("username").notEmpty().withMessage("Please enter your username"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Please enter your password"),
];

export const registerValidator = [
  body("name").notEmpty().withMessage("Please enter your name"),
  ...loginValidator,
];

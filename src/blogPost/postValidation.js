import { body } from "express-validator";

export const postValidationMiddleware = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Please assign a category"),
  body("content").exists().withMessage("Content is a mandatory field"),
];

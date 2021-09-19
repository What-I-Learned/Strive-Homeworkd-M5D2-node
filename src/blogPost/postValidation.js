import { body } from "express-validator";

export const postValidationMiddleware = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Please assign a category"),
  body("content").exists().withMessage("Content is a mandatory field"),
];
export const commentValidatioin = [
  body("author").exists().withMessage("Author is a mandatory field!"),
  body("text").exists().withMessage("Text is required"),
];

import { body } from "express-validator";

const mandatoryFields = [
  "name",
  "surname",
  "email",
  "birthDate",
  "avatar",
  "age",
];

export const authortValidationMiddleware = mandatoryFields.map((field) => {
  return body(field).exists().withMessage(`${field} is a mandatory field!`);
});

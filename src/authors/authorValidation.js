import { body } from "express-validator";

const mandatoryFields = [
  "name",
  "surname",
  "email",
  "birthdate",
  "avatar",
  "age",
];
// export const authortValidationMiddleware = [
//   body("age").exists().withMessage(`Age is a mandatory field!`),
// ];
export const authortValidationMiddleware = () =>
  mandatoryFields.forEach((field) => {
    body(field).exists().withMessage(`${field} is a mandatory field!`);
  });

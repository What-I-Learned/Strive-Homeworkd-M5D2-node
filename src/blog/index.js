// 1. CREATE --> POST http://localhost:3001/blog (+body)
// 2. READ --> GET http://localhost:3001/blog
// 3. READ --> GET http://localhost:3001/blog/:id
// 4. UPDATE --> PUT http://localhost:3001/blog/:id (+body)
// 5. DELETE --> DELETE http://localhost:3001/blog/:id

import express from "express"; // 3RD PARTY MODULE
import fs from "fs"; // CORE MODULE
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; // CORE MODULE
import uniqid from "uniqid"; // 3RD PARTY MODULE
import { request } from "http";

const authorsRouter = express.Router();
// To obtain the studentsJSONFilePath I need to do the following:
// 1. I'll start from the current file path I'm in right now (c:/..../src/services/students/index.js)
const currentFilePath = fileURLToPath(import.meta.url);
// 2. I'll obtain the current folder index.js file is in (c:/..../src/services/students)
const currentDirPath = dirname(currentFilePath);
// 3. I'll concatenate folder path with students.json (c:/..../src/services/students/students.json) DO NOT USE "+" SYMBOL TO CONCATENATE TWO PATHS TOGETHER
const authorsJSONFilePath = join(currentDirPath, "authors.json");
console.log(authorsJSONFilePath);

// 1. CREATE
authorsRouter.post("/", (req, res) => {
  // create new object
  const newAuthor = { ...request.body, id: uniqid(), createdAt: newDate() };
  //   read authors.json to get back the array
  const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath));
  // add new author to the list
  authors.push(newAuthor);
  // write the array back to the file
  fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
  // send a response
  res.status(201).send({ id: newAuthor.id });
});
// 2. READ --> GET
authorsRouter.get("/", (req, res) => {
  // read authors.json file parse it
  const authors = JSON.parse(
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors))
  );
  // send back the response
  res.send(authors);
});
// 3. READ --> GET BY id
authorsRouter.get("/:id", (req, res) => {
  res.send("hello world");
});
// 4. UPDATE --> PUT
authorsRouter.put("/:id", (req, res) => {
  res.send("hello world");
});
// 5. DELETE --> DELETE
authorsRouter.delete("/:id", (req, res) => {
  res.send("hello world");
});

export default authorsRouter;

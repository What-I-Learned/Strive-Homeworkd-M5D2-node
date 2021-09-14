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
// 1. I'll start from the current file path I'm in right now (c:/..../src/blog/index.js)
const currentFilePath = fileURLToPath(import.meta.url);
// 2. I'll obtain the current folder index.js file is in (c:/..../src/blog)
const currentDirPath = dirname(currentFilePath);
// 3. I'll concatenate folder path with authors.json (c:/..../src/blog/students.json) DO NOT USE "+" SYMBOL TO CONCATENATE TWO PATHS TOGETHER
const authorsJSONFilePath = join(currentDirPath, "authors.json");
console.log(authorsJSONFilePath);

// array of authors
const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath));

// 1. CREATE
authorsRouter.post("/", (req, res) => {
  // create new object
  //   keys that are created in the server
  const newAuthor = { id: uniqid(), ...req.body, createdAt: new Date() };
  //   read authors.json to get back the array and
  // add new author to the list
  authors.push(newAuthor);
  // write the array back to the file
  fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
  // send a response
  res.status(201).send({ id: newAuthor.id });
});
// 2. READ --> GET all
authorsRouter.get("/", (req, res) => {
  // read authors.json file parse it
  //   const authors = JSON.parse(fs.readFileSync(authorsJSONFilePath)); // we get buffer which is the content of the file and parse it
  // send back the response
  res.send(authors);
});
// 3. READ --> GET BY id one
authorsRouter.get("/:id", (req, res) => {
  // get a list

  // find an author based on id
  const author = authors.find((author) => author.id === req.params.id);
  //   send back the response
  if (author) {
    res.status(200).send(author);
  } else {
    res.status(404).send("not found");
  }
});
// 4. UPDATE --> PUT
authorsRouter.put("/:id", (req, res) => {
  // get array of authors and modify specific author
  const index = authors.findIndex((author) => author.id === req.params.id);
  // update author
  const updatedAuthor = { ...authors[index], ...req.body };
  authors[index] = updatedAuthor;
  //   save the file with update list of authors
  fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
  // send response
  res.send("updated");
});
// 5. DELETE --> DELETE
authorsRouter.delete("/:id", (req, res) => {
  // array of authors and filter out by id
  const index = authors.filter((author) => author.id !== req.params.id); // possible to do with slice but
  //write remaining authors into the file
  fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
  //   send back the response

  res.status(204).send("deleted");
});
// 6.POST authors/checkEmail
authorsRouter.post("/checkEmail", (req, res) => {
  // create new object
  //   keys that are created in the server
  const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date() };
  //   read authors.json to get back the array and
  // add new author to the list if email is not the same
  const emailAlreadeyInUse = authors.some(
    (author) => author.email === newAuthor.email
  );
  if (!emailAlreadeyInUse) {
    //   read authors.json to get back the array and
    // add new author to the list
    authors.push(newAuthor);
    // write the array back to the file
    fs.writeFileSync(authorsJSONFilePath, JSON.stringify(authors));
    // send a response
  }
  res
    .status(201)
    .send(
      emailAlreadeyInUse
        ? "it already exists"
        : "you are good to go" + JSON.stringify(newAuthor)
    );
});

export default authorsRouter;

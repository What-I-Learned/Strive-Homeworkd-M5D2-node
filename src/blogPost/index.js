import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import { postValidationMiddleware } from "./postValidation.js";
import createHttpError from "http-errors";

const blogPostsRouter = express.Router();

// path to file
const blogPostJsonFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);

// global const
const getPosts = () => JSON.parse(fs.readFileSync(blogPostJsonFilePath));
const writePostFile = (content) =>
  fs.writeFileSync(blogPostJsonFilePath, JSON.stringify(content));
//create
blogPostsRouter.post("/", postValidationMiddleware, (req, res, next) => {
  const errorsList = validationResult(req);

  if (!errorsList.isEmpty()) {
    next(createHttpError(400, { errorsList }));
  } else {
    try {
      const newPost = {
        _id: uniqid(),
        ...req.body,
        createdAt: new Date(),
      };
      const blogPosts = getPosts();
      blogPosts.push(newPost);
      writePostFile(blogPosts);

      res.status(200).send({ id: newPost._id });
    } catch (err) {
      next(err);
    }
  }
});
//Get all
blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPosts = getPosts();
    res.status(200).send(blogPosts);
  } catch (err) {
    next(err);
  }
});
//Get one
blogPostsRouter.get("/:postId", (req, res, next) => {
  try {
    const blogPosts = getPosts();
    const post = blogPosts.find(
      (post) => post._id.toString() === req.params.postId
    );
    if (post) {
      res.status(200).send(post);
    } else {
      //   res.status(404).send("not found");
      next(
        createHttpError(404, `Post with ID ${req.params.postId} not found!`)
      );
    }
  } catch (err) {
    next(err);
  }
});
//Edit one
blogPostsRouter.put("/:postId", postValidationMiddleware, (req, res, next) => {
  const errorsList = validationResult(req);
  if (!errorsList.isEmpty()) {
    next({ errorsList });
  } else {
    try {
      const blogPosts = getPosts();
      const postIndex = blogPosts.findIndex(
        (post) => post._id === req.params.postId
      );
      const updatedPost = { ...blogPosts[postIndex], ...req.body };
      blogPosts[postIndex] = updatedPost;
      writePostFile(blogPosts);
      res.status(200).send("updated");
    } catch (err) {
      next(err);
    }
  }
});

//DeleteOne
blogPostsRouter.delete("/:postId", (req, res, next) => {
  try {
    const blogPosts = getPosts();
    const filtered = blogPosts.filter((post) => post._id !== req.params.postId);
    writePostFile(filtered);
    res.status(204).send("deleted");
  } catch (err) {
    next(err);
  }
});

export default blogPostsRouter;

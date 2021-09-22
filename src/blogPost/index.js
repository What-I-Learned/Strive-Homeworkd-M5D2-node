import express from "express";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { imageUpload, getPosts, writePosts } from "../../utils/postUtils.js";
import { commentValidatioin } from "./postValidation.js";
import { getPDFReadableStream } from "../../utils/pdf.js";
import { pipeline } from "stream";

const blogPostsRouter = express.Router();

//create
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = {
      _id: uniqid(),

      ...req.body,
      comments: [],
      createdAt: new Date(),
    };

    const blogPosts = await getPosts();
    blogPosts.push(newPost);
    await writePosts(blogPosts);

    // let data = JSON.stringify(newPost);
    // fs.writeFileSync(postJsonFile, data);
    // console.log(req.file.path);
    res.status(200).send({ newPost });
  } catch (err) {
    next(err);
  }
});
//add image
blogPostsRouter.post(
  "/:id/coverImage",
  imageUpload.single("cover"),
  async (req, res, next) => {
    try {
      const posts = await getPosts();
      const post = posts.find((post) => post._id === req.params.id);
      if (!post) {
        next(createHttpError(400, { message: error.message }));
      } else {
        post["coverURL"] = req.file.path;
        await writePosts(posts);

        res.status(200).send("image uploaded");
      }
    } catch (err) {
      next(createHttpError(400, { message: error.message }));
    }
  }
);
//Get all
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    if (req.query && req.query.title) {
      const filteredPosts = blogPosts.filter(
        (post) => post.title === req.query.title
      );
      res.status(201).send(filteredPosts);
    } else {
      res.status(201).send(blogPosts);
    }
  } catch (err) {
    next(err);
  }
});
//Get one
blogPostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const post = blogPosts.find((post) => post._id === req.params.postId);
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, "Post with this id was not found"));
    }
  } catch (err) {
    next(err);
  }
});
// get pdf
blogPostsRouter.get("/:postId/pdf", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const post = blogPosts.find((post) => post._id === req.params.postId);
    if (post) {
      const source = await getPDFReadableStream(post);
      res.setHeader("Content-Type", "application/pdf"); // this header tells the browser to open the "save file as" dialog
      const destination = res;

      pipeline(source, destination, (err) => {
        if (err) next(err);
      });
    } else {
      next(createHttpError(404, "Post with this id was not found"));
    }
  } catch (err) {
    next(err);
  }
});

//Edit one
blogPostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const postIndex = blogPosts.findIndex(
      (post) => post._id === req.params.postId
    );
    const postToEdit = blogPosts[postIndex];
    const updatedPost = { ...postToEdit, ...req.body, updatedAt: new Date() };

    blogPosts[postToEdit] = updatedPost;
    await writePosts(blogPosts);
    res.send(updatedPost);
  } catch (err) {
    next(err);
  }
});

// add comment
blogPostsRouter.put(
  "/:postId/comments",
  commentValidatioin,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(
          createHttpError(400, {
            message: "comment validation failed",
            errors: errors.array(),
          })
        );
      }
      const blogPosts = await getPosts();
      const postIndex = blogPosts.findIndex(
        (post) => post._id === req.params.postId
      );
      if (postIndex == -1) {
        next(createHttpError(404, "Post not found"));
      } else {
        const newComment = {
          id: uniqid(),
          ...req.body,
          createdAt: new Date(),
        };
        blogPosts[postIndex].comments.push(newComment);
        await writePosts(blogPosts);
        res.send(newComment);
      }
    } catch (err) {
      next(createHttpError(400, err.message));
    }
  }
);

//DeleteOne
blogPostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const filteredPosts = blogPosts.filter(
      (post) => post._id !== req.params.postId
    );
    await writePosts(filteredPosts);
    res.status(204).send("deleted");
  } catch (err) {
    next(err);
  }
});
//DeleteOne a comment
blogPostsRouter.delete(
  "/:postId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPosts = await getPosts();
      const postIndex = blogPosts.findIndex(
        (post) => post._id === req.params.postId
      );

      if (postIndex == -1) {
        next(createHttpError(404, "Post not found"));
      } else {
        const filteredComments = blogPosts[postIndex].comments.filter(
          (comment) => comment.id !== req.params.commentId
        );
        blogPosts[postIndex].comments = filteredComments;
        await writePosts(blogPosts);
        res.send("deleted");
      }
    } catch (err) {
      next(err);
    }
  }
);
export default blogPostsRouter;

import express from "express";
import bodyParser from "body-parser";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

import authorsRouter from "./authors/index.js"; // remeber to use extension
import blogPostsRouter from "./blogPost/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js";
import { publicFolderPath } from "../utils/fs-utils.js";

const app = express(); // server
const PORT = 3002; // port number

app.use(cors()); // enable FE to communicate with BE
app.use(express.static(publicFolderPath));
app.use(bodyParser.json()); // to parse the request body else it would be undefined

// endpoints
app.use("/authors", authorsRouter);
app.use("/blogPosts", blogPostsRouter);

// error middlewares
app.use(badRequestErrorHandler);
app.use(notFoundErrorHandler);
app.use(forbiddenErrorHandler);
app.use(genericServerErrorHandler);

// listen to requests
app.listen(PORT, () => {
  console.log("Server is running");
});

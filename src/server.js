import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authorsRouter from "./authors/index.js"; // remeber to use extension
import blogPostsRouter from "./blogPost/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js";
import { publicFolderPath } from "../utils/postUtils.js";
import listEndpoints from "express-list-endpoints";

const app = express(); // server
const PORT = process.env.PORT || 3005; // port number

const whitelist = [process.env.FE_DEV_URL, process.env.FE_VER_URL];
const corsOpts = {
  origin: function (origin, next) {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Origin is not allowed"));
    }
  },
};

app.use(cors(corsOpts)); // enable FE to communicate with BE
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

console.table(listEndpoints(app));

// listen to requests
app.listen(PORT, () => {
  console.log("Server is running");
});

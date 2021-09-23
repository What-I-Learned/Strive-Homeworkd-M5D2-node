import path from "path";
import fs from "fs-extra";
import uniqid from "uniqid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const { readJSON, writeJSON } = fs;

export const publicFolderPath = path.join(process.cwd(), "public");

// cloud storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // automatically read CLOUDINARY_URL from process.env.CLOUDINARY_URL
  params: {
    folder: "blog",
  },
});

// set storage for the files
const storage = multer.diskStorage({
  destination: publicFolderPath,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  filename: function (req, file, cb) {
    cb(null, uniqid() + path.extname(file.originalname));
  },
});

export const imageUpload = multer({ storage: cloudinaryStorage });

// path to post json
const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data"
);
const postsJSONPath = join(dataFolderPath, "posts.json");
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const writePosts = (content) => writeJSON(postsJSONPath, content);
export const getPosts = () => readJSON(postsJSONPath);
export const getPostsReadableStream = () => fs.createReadStream(postsJSONPath);

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);
export const getAuthors = () => readJSON(authorsJSONPath);

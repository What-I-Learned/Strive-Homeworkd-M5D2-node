import path from "path";
import fs from "fs-extra";
import uniqid from "uniqid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

export const publicFolderPath = path.join(process.cwd(), "public");

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

export const imageUpload = multer({ storage: storage });

// path to post json
const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data"
);
const postsJSONPath = join(dataFolderPath, "posts.json");

export const writePosts = (content) => writeJSON(postsJSONPath, content);
export const getPosts = () => readJSON(postsJSONPath);

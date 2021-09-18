import path from "path";
import fs from "fs-extra";
import uniqid from "uniqid";

export const publicFolderPath = path.join(process.cwd(), "public");

console.log(publicFolderPath + " public folder path");

export const writeFileToPublic = async (file) => {
  try {
    // change name of the file to uniqid
    const [name, extension] = file.originalname.split("."); // somePicture.jpg => ['somePicture','jpg']
    const id = uniqid();
    const newFileName = `${id}.${extension}`;
    //   where it will be stored
    const filePath = path.join(publicFolderPath, newFileName);
    await fs.writeFile(filePath, file.buffer);
    console.log(filePath);

    const url = `http://localhost:3002/blogPosts/image/${newFileName}`;
    return { url, id };
    // generate unique file name with uniq id
    // write file to public folder
    // return url of file
  } catch (error) {
    throw error;
  }
};

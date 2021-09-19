import createHttpError from "http-errors";
const acceptedExtensions = ["png", "jpg", "gif", "jpeg"];

export const fileIsRequired = (req, res, next) => {
  const [name, extension] = req.file.originalname.split(".");
  if (!acceptedExtensions.includes(extension)) {
    next(
      createHttpError(400, `File is not valid ${acceptedExtensions.join(",")}`)
    );
  } else {
    next();
  }
};

import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";
import { promisify } from "util";
import { pipeline } from "stream";
import { fs } from "fs-extra";

export const getPDFReadableStream = async (content) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };
  let imagePart = {};
  const blogCoverURLParts = content.coverURL.split("/");
  const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
  const [id, extension] = fileName.split(".");
  console.log(fileName, extension);
  try {
    const response = await imageToBase64(content.coverURL);
    console.log(content.coverURL);

    const base64Image = `data:image/${extension};base64,${response}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  } catch (err) {
    console.log(err);
  }

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      imagePart,
      { text: content.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
    ],
  };

  const options = {
    // ...
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();
  return pdfReadableStream;
};
/* pdfDoc.pipe(fs.createWriteStream('document.pdf')) is exactly the same as pipeline(pdfDoc, fs.createWriteStream('document.pdf')) 
pipeline is the NEWER SYNTAX which solves a lot of problems under the hood
*/

export const generatePDFAsync = async (data) => {
  const asyncPipeline = promisify(pipeline); // promisify is an utility which transforms a function that uses callbacks into a function that uses Promises (and so Async/Await). Pipeline is a function that works with callbacks to connect two or more streams together --> I can promisify pipeline getting back an asynchronous pipeline

  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };
  let imagePart = {};
  const blogCoverURLParts = content.coverURL.split("/");
  const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
  const [id, extension] = fileName.split(".");
  console.log(fileName, extension);
  try {
    const response = await imageToBase64(content.coverURL);
    console.log(content.coverURL);

    const base64Image = `data:image/${extension};base64,${response}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  } catch (err) {
    console.log(err);
  }

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      imagePart,
      { text: content.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
    ],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  const pdfPath = join(dirname(fileURLToPath(import.meta.url)), "example.pdf");

  await asyncPipeline(pdfReadableStream, fs.createWriteStream(pdfPath)); // when the stream ends, this will resolve the promise. If the stream has any error this is going to reject the promise

  return path;
};

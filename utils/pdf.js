import PdfPrinter from "pdfmake";
import fs from "fs";
import { pipeline } from "stream";

export const getPDFReadableStream = async (content) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
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

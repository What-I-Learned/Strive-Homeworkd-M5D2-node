import PdfPrinter from "pdfmake";
import fs from "fs";
import { pipeline } from "stream";

export const getPDFReadableStream = () => {
  const fonts = {
    Roboto: {
      normal: "fonts/Roboto-Regular.ttf",
      bold: "fonts/Roboto-Medium.ttf",
      italics: "fonts/Roboto-Italic.ttf",
      bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [],
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

  pipeline(pdfDoc, fs.createWriteStream("document.pdf"));
  pdfDoc.end();
  return pdfReadableStream;
};

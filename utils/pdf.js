import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

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

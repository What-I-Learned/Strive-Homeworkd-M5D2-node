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

  try {
    const response = await imageToBase64(content.coverURL);

    const base64Image = `data:image/${response};base64,...encodedContent...'`;
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

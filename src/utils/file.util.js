import JSZip from "jszip";
import { parseStringPromise } from "xml2js";

import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const readFile = async (name, buffer) => {
  const splittedName = name.split(".");
  const extension = splittedName[splittedName.length - 1];

  if (extension == "txt") {
    return buffer.toString("utf8");
  }

  if (extension == "pptx") {
    const pptxText = await extractPptxText(buffer);
    return pptxText;
  }

  if (extension == "pdf") {
    const pdfText = await pdfParse(buffer);
    return pdfText.text;
  }
};

async function extractPptxText(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const texts = [];

  const slideFiles = Object.keys(zip.files).filter((f) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(f)
  );

  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)\.xml$/)[1], 10);
    const numB = parseInt(b.match(/slide(\d+)\.xml$/)[1], 10);
    return numA - numB;
  });

  for (const fileName of slideFiles) {
    const fileData = await zip.file(fileName).async("string");
    const xml = await parseStringPromise(fileData);

    const slideTexts = [];
    const shapes = xml["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"] || [];
    for (const shape of shapes) {
      const paras = shape["p:txBody"]?.[0]["a:p"] || [];
      for (const p of paras) {
        const runs = p["a:r"] || [];
        for (const r of runs) {
          if (r["a:t"]) slideTexts.push(r["a:t"].join(""));
        }
      }
    }
    texts.push(slideTexts.join(" "));
  }

  return texts.join("\n\n");
}

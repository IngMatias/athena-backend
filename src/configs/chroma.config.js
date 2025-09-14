import { ChromaClient } from "chromadb";

const CHROMA_HOST = process.env.CHROMA_HOST;
const CHROMA_PORT = process.env.CHROMA_PORT;

console.log(CHROMA_HOST);
console.log(CHROMA_PORT);

export const client = new ChromaClient({
  path: `${CHROMA_HOST}:${CHROMA_PORT}`,
});

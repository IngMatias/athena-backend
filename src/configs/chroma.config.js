import { ChromaClient } from "chromadb";
import { embeddingFunction } from "../external/chatgpt.external.js";

const CHROMA_HOST = process.env.CHROMA_HOST;
const CHROMA_PORT = process.env.CHROMA_PORT;

export const client = new ChromaClient({
  path: `${CHROMA_HOST}:${CHROMA_PORT}`,
});

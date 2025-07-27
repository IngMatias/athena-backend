import { ChromaClient } from "chromadb";

const CHROMA_HOST = process.env.CHROMA_HOST;
const CHROMA_PORT = process.env.CHROMA_PORT;

export const client = new ChromaClient({ host: CHROMA_HOST, port: CHROMA_PORT });

import { MongoClient } from "mongodb";

const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

const client = new MongoClient(url);

let db;

export async function conectar() {
  try {
    await client.connect();
    db = client.db("mongo");
  } catch (err) {
    console.error("Error al conectar mongo:", err);
  }
}

conectar();

export { db };

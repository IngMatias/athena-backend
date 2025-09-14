import { db } from "../configs/mongo.config.js";

export const getSelectedDocuments = async (courseId) => {
  const collection = db.collection("selectedDocuments");

  const result = await collection.find({ courseId, selected: true }).toArray();

  return result.map((f) => f.fileId);
};

export const upsertSelectedDocument = async (courseId, fileId, selected) => {
  const collection = db.collection("selectedDocuments");

  const result = await collection.updateOne(
    { courseId, fileId },
    {
      $set: { selected },
    },
    { upsert: true }
  );

  return result;
};

export const delSelectedDocuments = async (fileId) => {
  const collection = db.collection("selectedDocuments");

  const result = await collection.deleteMany({ fileId });

  return result;
};

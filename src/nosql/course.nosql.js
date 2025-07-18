import { db } from "../configs/mongo.config.js";

export const upsertSections = async (courseId, sections) => {
  const collection = db.collection("sections");

  const result = await collection.updateOne(
    { courseId },
    {
      $set: { sections },
    },
    { upsert: true }
  );

  return result;
};

export const upsertContents = async (contents) => {
  const collection = db.collection("contents");

  const operationsDel = contents.map(({ courseId, sectionId }) => ({
    deleteMany: {
      filter: { courseId },
    },
  }));

  const delResult = await collection.bulkWrite(operationsDel);

  const operations = contents.map(({ courseId, sectionId, content }) => ({
    updateOne: {
      filter: {
        courseId,
        sectionId,
      },
      update: {
        $set: { courseId, sectionId, content },
      },
      upsert: true,
    },
  }));

  const result = await collection.bulkWrite(operations);

  return result;
};

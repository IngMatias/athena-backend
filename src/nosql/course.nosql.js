import { db } from "../configs/mongo.config.js";

export const getSections = async (courseId) => {
  const collection = db.collection("sections");

  const result = await collection.findOne({ courseId });

  console.log("result", result);

  return result;
};

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

export const getContent = async (courseId, sectionId) => {
  const collection = db.collection("contents");

  const content = await collection.findOne({ courseId, sectionId });

  console
  console.log("cont", content);

  return content;
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

  console.log("result", result);

  return result;
};

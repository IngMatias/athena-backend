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

export const getAllCourseContent = async (courseId) => {
  const collection = db.collection("contents");

  const contents = await collection.find({ courseId }).toArray();

  return contents;
};

export const getContent = async (courseId, sectionId) => {
  const collection = db.collection("contents");

  const result = await collection.findOne({ courseId, sectionId });

  return result ? result.content : [];
};

export const getOneContent = async (courseId, sectionId, contentId) => {
  const collection = db.collection("contents");

  const { content } = await collection.findOne(
    {
      courseId,
      sectionId,
      "content.id": contentId,
    },
    { projection: { content: { $elemMatch: { id: contentId } } } }
  );

  return content[0];
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

export const getChecks = async (
  userId,
  courseId,
  sectionId,
  contentId,
  result
) => {
  const collection = db.collection("checks");

  const query = {
    userId: { $ne: null },
    courseId: { $ne: null },
    sectionId: { $ne: null },
    contentId: { $ne: null },
    result: { $ne: null },
  };

  if (userId !== undefined) query.userId = userId;
  if (courseId !== undefined) query.courseId = courseId;
  if (sectionId !== undefined) query.sectionId = sectionId;
  if (contentId !== undefined) query.contentId = contentId;
  if (result !== undefined) query.result = result;

  return await collection.find(query).toArray();
};

export const getLatestChecksByContentId = async (
  userId,
  courseId,
  sectionId,
  contentId,
  result
) => {
  const collection = db.collection("checks");

  const match = {
    userId: { $ne: null },
    courseId: { $ne: null },
    sectionId: { $ne: null },
    contentId: { $ne: null },
    result: { $ne: null },
  };

  if (userId !== undefined) match.userId = userId;
  if (courseId !== undefined) match.courseId = courseId;
  if (sectionId !== undefined) match.sectionId = sectionId;
  if (contentId !== undefined) match.contentId = contentId;
  if (result !== undefined) match.result = result;

  const results = await collection
    .aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$contentId",
          latestCheck: { $first: "$$ROOT" },
        },
      },
    ])
    .toArray();

  const checksMap = {};
  for (const entry of results) {
    checksMap[entry._id] = entry.latestCheck;
  }

  return checksMap;
};

export const postCheck = async (
  userId,
  courseId,
  sectionId,
  contentId,
  answerTry,
  result
) => {
  const collection = db.collection("checks");

  return await collection.insertOne({
    userId,
    courseId,
    sectionId,
    contentId,
    result,
    answerTry,
    createdAt: new Date(),
  });
};


export const getCaptions = async (videoId) => {
  const collection = db.collection("captions");

  const result = await collection.findOne({ videoId });

  return result;
};

export const insertCaptions = async (videoId, captions) => {
  const collection = db.collection("captions");

  const result = await collection.updateOne(
    { videoId },
    {
      $set: { captions },
    },
    { upsert: true }
  );

  return result;
};
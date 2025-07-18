import {
  getTags,
  postCourse,
  upsertCourseDetails,
  getCourseDetails,
  delCourse,
} from "../db/course.db.js";
import { upsertContents, upsertSections } from "../nosql/course.nosql.js";
import { getContent } from "../websocket/content.websocket.js";
import { getSections } from "../websocket/section.websocket.js";

export const postCourseController = async (req, res) => {
  const { id: userId, languageId } = req.user;

  const data = await postCourse({ userId });

  res.json({ data });
};

const getSectionsIds = (sections) => {
  const ids = [];
  const stack = [...sections];

  while (stack.length > 0) {
    const nodo = stack.pop();

    if (nodo.id) {
      ids.push(nodo.id);
    }

    if (nodo.sections && Array.isArray(nodo.sections)) {
      stack.push(...nodo.sections);
    }
  }

  return ids;
};

export const postCourseContentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const sections = await getSections(courseId);
  await upsertSections(courseId, sections);

  const sectionsId = getSectionsIds(sections);
  const contents = [];

  for (const sectionId of sectionsId) {
    const content = await getContent(courseId, sectionId);
    if (content && content.length > 0) {
      contents.push({
        courseId,
        sectionId,
        content,
      });
    }
  }

  await upsertContents(contents);

  res.json({});
};

export const delCourseController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const data = await delCourse({ userId, courseId });

  res.json({ data });
};

export const getCourseDetailsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  let { courseId } = req.params;

  const data = await getCourseDetails({
    courseId,
    userId,
    languageId,
  });

  res.json({ data });
};

export const postCourseDetailsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  let { courseId, title, description, tagsIds } = req.body;

  const data = await upsertCourseDetails({
    courseId,
    userId,
    languageId,
    title,
    description,
    tagsIds,
  });

  res.json({ data });
};

export const getTagsController = async (req, res) => {
  const { languageId } = req.user;
  let { contains } = req.query;

  const pageSize = 5;

  const data = await getTags({ languageId, pageSize, contains });

  res.json({ data });
};

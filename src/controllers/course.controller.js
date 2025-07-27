import {
  getTags,
  postCourse,
  upsertCourseDetails,
  getCourseDetails,
  delCourse,
  postEnrollment,
  getEnrollment,
} from "../db/course.db.js";
import {
  getContent as getContentMongo,
  upsertContents,
  upsertSections,
} from "../nosql/course.nosql.js";
import { getImagesUrls, setImage } from "../s3/imges.s3.js";
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

export const getCourseSectionsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const sections = await getSections(courseId);

  res.json({ data: { sections } });
};

export const getCourseContentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId, sectionId } = req.params;

  const { content } = await getContentMongo(courseId, sectionId);

  res.json({ data: { content } });
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

export const postCourseImageController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.body;
  const file = req.file;

  const data = await setImage(courseId, file.buffer);

  res.json({ data });
};

export const getCourseImageController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  let { courseId } = req.params;

  const imagesUrls = await getImagesUrls([courseId]);

  res.json({ data: { imageUrl: imagesUrls[courseId] } });
};

export const getTagsController = async (req, res) => {
  const { languageId } = req.user;
  let { contains } = req.query;

  const pageSize = 5;

  const data = await getTags({ languageId, pageSize, contains });

  res.json({ data });
};

export const getEnrollmentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  let { courseId } = req.params;

  const data = await getEnrollment({ userId, courseId });

  console.log("getEnrollmentController", data);

  res.json({ data });
};

export const postEnrollmentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  let { courseId } = req.params;

  const data = await postEnrollment({ userId, courseId });

  console.log("postEnrollmentController", data);

  res.json({ data });
};

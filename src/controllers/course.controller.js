import {
  getTags,
  postCourse,
  upsertCourseDetails,
  getCourseDetails,
  delCourse,
  postEnrollment,
  getEnrollment,
  updateEnrollment,
} from "../db/course.db.js";
import ExercisesEnum from "../enums/Exercises.enum.js";
import {
  getChecks,
  getContent as getContentMongo,
  getAllCourseContent,
  getLatestChecksByContentId,
  getOneContent,
  postCheck,
  upsertContents,
  upsertSections,
} from "../nosql/course.nosql.js";
import { getImagesUrls, getStreamImage, setImage } from "../s3/imges.s3.js";
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

  let content = await getContentMongo(courseId, sectionId);

  const latestChecks = await getLatestChecksByContentId(
    userId,
    courseId,
    sectionId
  );

  content = content.map((item) => {
    // Remove answers
    const { answer, ...noAnswer } = item;

    // Add the latest result
    const lastCheck = latestChecks[item.id];

    if (lastCheck) {
      const { answerTry, result } = lastCheck;
      noAnswer.answer = answerTry;
      noAnswer.result = result;
    }

    return noAnswer;
  });

  console.log(content);

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

  console.log("courseId", courseId);
  console.log("userId", userId);
  console.log("languageId", languageId);

  const data = await getCourseDetails({
    courseId,
    userId,
    languageId,
  });

  console.log("data", data);

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
  const { imageUrl } = req.params;

  const imageStream = getStreamImage(imageUrl);

  // Configuramos headers para que el navegador interprete la respuesta como imagen
  res.setHeader("Content-Type", "image/jpeg"); // Cambiar según el tipo de imagen
  res.setHeader("Cache-Control", "public, max-age=31536000"); // Opcional, para cache

  // Pipe del stream al response
  imageStream.pipe(res);

  // Manejo de errores del stream
  imageStream.on("error", (err) => {
    console.error("Error leyendo la imagen", err);
    res.status(500).send("Error al obtener la imagen");
  });
};

export const getCourseImageUrlController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const imagesUrls = await getImagesUrls([courseId]);

  res.json({ data: { imageUrl: imagesUrls[courseId] } });
};

export const getTagsController = async (req, res) => {
  const { languageId } = req.user;
  const { contains } = req.query;

  const pageSize = 5;

  const data = await getTags({ languageId, pageSize, contains });

  res.json({ data });
};

export const getEnrollmentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const data = await getEnrollment({ userId, courseId });

  res.json({ data });
};

export const postEnrollmentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const data = await postEnrollment({ userId, courseId });

  res.json({ data });
};

export const postAnswerController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId, sectionId, contentId } = req.params;
  const { answerTry } = req.body;

  const checksTrue = await getChecks(
    userId,
    courseId,
    sectionId,
    contentId,
    true
  );

  if (checksTrue.length > 0) {
    res.json({ err: "Already answer correctly" });
    return;
  }

  const content = await getOneContent(courseId, sectionId, contentId);
  const { type, answer } = content;

  let result = content.result;

  if (type === ExercisesEnum.type.TRUE_FALSE) {
    result = answer === answerTry;
  } else {
    res.json({ err: "No implemented exercise check" });
    return;
  }

  await postCheck(userId, courseId, sectionId, contentId, answerTry, result);

  res.json({ data: { result } });
};

export const getCertificateController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const enroll = await getEnrollment({ userId, courseId });

  if (!enroll) {
    res.json({ err: "User not enrolled to course!" });
    return;
  }

  if (enroll.completedAt) {
    res.json({ err: "Already completed course!" });
    return;
  }

  let sections = await getAllCourseContent(courseId);

  const latestChecks = await getLatestChecksByContentId(userId, courseId);

  sections = sections.map((section) => {
    let content = section.content.map((item) => {
      const { answer, ...noAnswer } = item;
      // Add the latest result
      const lastCheck = latestChecks[item.id];

      if (lastCheck) {
        const { answerTry, result } = lastCheck;
        noAnswer.answer = answerTry;
        noAnswer.result = result;
      }

      return noAnswer;
    });
    section.content = content;

    return section;
  });

  let uncompleted = { sectionId: undefined, contentId: undefined };

  let courseCompleted = sections.every((section) => {
    uncompleted.sectionId = section.sectionId;
    return section.content.every((content) => {
      uncompleted.contentId = content.id;
      return (
        !(content.type in ExercisesEnum.type) ||
        (content.type in ExercisesEnum.type && content.result)
      );
    });
  });

  if (courseCompleted) {
    const data = await updateEnrollment({
      userId,
      courseId,
      completedAt: new Date(),
    });

    res.json({ data });
  } else {
    console.log("uncompleted", uncompleted);
    res.json({ data: uncompleted });
  }
};

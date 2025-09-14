import { getId } from "../utils/id.util.js";

import { getRoomData, setRoomData } from "../redis/room.redis.js";

import {
  getElaborations,
  getExercise,
  getKeypoints,
  getMindMap,
} from "../services/ai.content.service.js";
import { JSONbalance } from "../utils/json.js";
import { getSections } from "./section.websocket.js";

export const getContent = async (courseId, sectionId) => {
  const data = await getRoomData(`${courseId}-${sectionId}-content`);
  return data?.content;
};

const setContent = async (courseId, sectionId, content) => {
  await setRoomData(`${courseId}-${sectionId}-content`, { content });
};

export const joinContentHandler = async (socket, courseId, sectionId) => {
  let content = await getContent(courseId, sectionId);

  if (!content) {
    content = [];
  }

  await setContent(courseId, sectionId, content);

  socket.join(`${courseId}-${sectionId}`);
  socket.emit("set-content", content);
};

const addEmptyTextAt = (oldContent, i, id) => {
  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i) + 1, 0, {
    id,
    type: "TEXT",
    text: "",
  });
  return newContent;
};

export const addEmptyTextHandler = async (socket, courseId, sectionId, i) => {
  let content = await getContent(courseId, sectionId);

  const id = getId();
  content = addEmptyTextAt(content, i, id);

  await setContent(courseId, sectionId, content);

  socket.emit("add-empty-text", i, id);
  socket.to(`${courseId}-${sectionId}`).emit("add-empty-text", i, id);
};

const addVideoAt = (oldContent, i, id) => {
  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i) + 1, 0, {
    id,
    type: "VIDEO",
    text: "",
  });
  return newContent;
};

export const addVideoHandler = async (socket, courseId, sectionId, i) => {
  let content = await getContent(courseId, sectionId);

  const id = getId();
  content = addVideoAt(content, i, id);

  await setContent(courseId, sectionId, content);

  socket.emit("add-video", i, id);
  socket.to(`${courseId}-${sectionId}`).emit("add-video", i, id);
};

const setContentAt = (oldContent, i, content) => {
  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent[i] = content;
  return newContent;
};

export const setContentAtHandler = async (
  socket,
  courseId,
  sectionId,
  i,
  content
) => {
  let oldContent = await getContent(courseId, sectionId);

  oldContent = setContentAt(oldContent, i, content);

  await setContent(courseId, sectionId, oldContent);

  socket.emit("set-content-at", i, content);
  socket.to(`${courseId}-${sectionId}`).emit("set-content-at", i, content);
};

const addExerciseAt = (oldContent, exercises, i, ids) => {
  exercises.forEach((exercise, index) => {
    exercise.id = ids[index];
  });

  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i) + 1, 0, ...exercises);
  return newContent;
};

export const addExerciseAtHandler = async (
  socket,
  courseId,
  sectionId,
  i,
  { numberOfExercises, type, difficulty, text, language, numberOfOptions }
) => {
  let content = await getContent(courseId, sectionId);

  const ids = Array.from({ length: numberOfExercises }, getId);

  socket.emit("init-add-exercise-at", ids);
  socket.to(`${courseId}-${sectionId}`).emit("init-add-exercise-at", ids);

  let exercisesStr = "";

  for await (const chunk of getExercise({
    numberOfExercises,
    type,
    difficulty,
    text,
    language,
    numberOfOptions,
  })) {
    exercisesStr += chunk;
    const balancedStr = JSONbalance(exercisesStr);
    const exercises = JSON.parse(balancedStr);

    const newContent = addExerciseAt(content, exercises, i, ids);

    await setContent(courseId, sectionId, newContent);

    socket.emit("add-exercise-at", i, chunk);
    socket.to(`${courseId}-${sectionId}`).emit("add-exercise-at", i, chunk);
  }
};

const addMindMapAt = (oldContent, mindMap, i, ids) => {
  mindMap.id = ids[0];

  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i) + 1, 0, mindMap);
  return newContent;
};

export const addMindMapAtHandler = async (
  socket,
  courseId,
  sectionId,
  i,
  { text }
) => {
  let content = await getContent(courseId, sectionId);

  const ids = Array.from({ length: 1 }, getId);

  socket.emit("init-add-exercise-at", ids);
  socket.to(`${courseId}-${sectionId}`).emit("init-add-exercise-at", ids);

  let mindMapsStr = "";

  for await (const chunk of getMindMap({
    text,
  })) {
    mindMapsStr += chunk;
    console.log(mindMapsStr);

    const balancedStr = JSONbalance(mindMapsStr);
    const mindMaps = JSON.parse(balancedStr);

    const newContent = addMindMapAt(content, mindMaps, i, ids);

    await setContent(courseId, sectionId, newContent);

    socket.emit("add-mind-map-at", i, chunk);
    socket.to(`${courseId}-${sectionId}`).emit("add-mind-map-at", i, chunk);
  }
};

const addKeypoints = (oldContent, keypoints, ids) => {
  keypoints.forEach((keypoint, index) => {
    keypoint.id = ids[index];
  });

  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(0, 0, ...keypoints);
  return newContent;
};

export const addKeypointsHandler = async (
  socket,
  courseId,
  sectionId,
  path
) => {
  const numberOfKeypoints = 10;
  const sections = await getSections(courseId);

  let content = await getContent(courseId, sectionId);

  const ids = Array.from({ length: numberOfKeypoints }, getId);

  socket.emit("init-add-keypoints", ids);
  socket.to(`${courseId}-${sectionId}`).emit("init-add-keypoints", ids);

  let keypointsStr = "";

  for await (const chunk of getKeypoints({
    sections,
    path,
    numberOfKeypoints,
  })) {
    keypointsStr += chunk;
    const balancedStr = JSONbalance(keypointsStr);
    const keypoints = JSON.parse(balancedStr);

    const newContent = addKeypoints(content, keypoints, ids);
    await setContent(courseId, sectionId, newContent);

    socket.emit("add-keypoints", chunk);
    socket.to(`${courseId}-${sectionId}`).emit("add-keypoints", chunk);
  }
};

const deleteContentAt = (oldContent, i) => {
  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i), 1);
  return newContent;
};

export const deleteContentAtHandler = async (
  socket,
  courseId,
  sectionId,
  i
) => {
  let content = await getContent(courseId, sectionId);

  content = deleteContentAt(content, i);

  await setContent(courseId, sectionId, content);

  socket.emit("delete-content-at", i);
  socket.to(`${courseId}-${sectionId}`).emit("delete-content-at", i);
};

const elaborateMoreAt = (oldContent, exercises, i, ids) => {
  exercises.forEach((exercise, index) => {
    exercise.id = ids[index];
  });

  const newContent = JSON.parse(JSON.stringify(oldContent));
  newContent.splice(parseInt(i) + 1, 0, ...exercises);
  return newContent;
};

export const elaborateMoreAtHandler = async (
  socket,
  courseId,
  sectionId,
  i
) => {
  const numberOfElaborations = 3;

  let content = await getContent(courseId, sectionId);

  const ids = Array.from({ length: numberOfElaborations }, getId);

  socket.emit("init-elaborate-more-at", ids);
  socket.to(`${courseId}-${sectionId}`).emit("init-elaborate-more-at", ids);

  let elaborationsStr = "";

  for await (const chunk of getElaborations({
    topic: content[i].text,
    numberOfElaborations,
  })) {
    elaborationsStr += chunk;
    const balancedStr = JSONbalance(elaborationsStr);
    const elaborations = JSON.parse(balancedStr);

    const newContent = elaborateMoreAt(content, elaborations, i, ids);

    await setContent(courseId, sectionId, newContent);

    socket.emit("elaborate-more-at", i, chunk);
    socket.to(`${courseId}-${sectionId}`).emit("elaborate-more-at", i, chunk);
  }
};

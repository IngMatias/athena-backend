import { GenerationDescriptionType } from "../enums/GenerationDescriptionType.enum.js";
import { GenerationTitleType } from "../enums/GenerationTitleType.enum.js";

import {
  getDescription,
  getTitle,
  getTitleQuestion,
  getDescriptionQuestion,
  getSections,
} from "../services/ai.course.service.js";
import { getId } from "../utils/id.util.js";

export const postAICourseDetailsTitleController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { generationTitleType, keywords, title } = req.body;

  if (!generationTitleType) {
    res.json({ err: "" });
  }

  if (!GenerationTitleType[generationTitleType]) {
    res.json({ err: "" });
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const chunk of getTitle({
    generationTitleType,
    keywords,
    title,
  })) {
    res.write(chunk);
  }

  res.end();
};

export const postAICourseDetailsDescriptionController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { generationDescriptionType, keywords, title, description } = req.body;

  if (!generationDescriptionType) {
    res.json({ err: "" });
  }

  if (!GenerationDescriptionType[generationDescriptionType]) {
    res.json({ err: "" });
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const chunk of getDescription({
    generationDescriptionType,
    keywords,
    title,
    description,
  })) {
    res.write(chunk);
  }

  res.end();
};

export const postAICourseDetailsTitleQuestionsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { questions, title } = req.body;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  let total = "";

  for await (const chunk of getTitleQuestion({
    questions,
    title,
  })) {
    total += chunk;
    res.write(chunk);
  }

  res.end();
};

export const postAICourseDetailsDescriptionQuestionsController = async (
  req,
  res
) => {
  const { id: userId, languageId } = req.user;
  const { questions, description } = req.body;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  let total = "";

  for await (const chunk of getDescriptionQuestion({
    questions,
    description,
  })) {
    total += chunk;
    res.write(chunk);
  }

  res.end();
};

export const getAICourseDetailsSectionIdController = async (req, res) => {
  const { id: userId, languageId } = req.user;

  res.json({ data: { id: getId() } });
};

export const postAICourseDetailsSectionsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { title, description, sectionsLength } = req.body;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  let total = "";

  for await (const chunk of getSections({
    title,
    description,
    sectionsLength,
  })) {
    total += chunk;
    res.write(chunk);
  }

  res.end();
};

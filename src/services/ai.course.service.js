import openaiExternal from "../external/chatgpt.external.js";

import { getTitleMessages } from "../prompts/title.prompt.js";
import { getDescriptionMessages } from "../prompts/description.prompt.js";
import { getTitleQuestionMessages } from "../prompts/title.question.js";
import { getDescriptionQuestionMessages } from "../prompts/description.question.js";
import { getSectionsMessages } from "../prompts/sections.prompt.js";

export async function* getTitle({ generationTitleType, keywords, title }) {
  const messages = getTitleMessages({ generationTitleType, keywords, title });

  for await (const chunk of openaiExternal.chat(messages)) {
    yield chunk;
  }
}

export async function* getDescription({
  generationDescriptionType,
  keywords,
  title,
  description,
}) {
  const messages = getDescriptionMessages({
    generationDescriptionType,
    keywords,
    title,
    description,
  });

  for await (const chunk of openaiExternal.chat(messages)) {
    yield chunk;
  }
}

export async function* getTitleQuestion({ questions, title }) {
  const messages = getTitleQuestionMessages({ questions, title });

  for await (const chunk of openaiExternal.chat(messages)) {
    yield chunk;
  }
}

export async function* getDescriptionQuestion({ questions, description }) {
  const messages = getDescriptionQuestionMessages({ questions, description });

  for await (const chunk of openaiExternal.chat(messages)) {
    yield chunk;
  }
}

export async function* getSections({ title, description, sectionsLength }) {
  const messages = getSectionsMessages({ title, description, sectionsLength });

  for await (const chunk of openaiExternal.chat(messages)) {
    yield chunk;
  }
}

import { readFile } from "../utils/file.util.js";
import {
  delDocument,
  getDocuments,
  postDocument,
  queryDocuments,
} from "../chroma/documents.chroma.js";
import { getAnswer, getAnswerByContext } from "../services/ai.chat.services.js";
import {
  delSelectedDocuments,
  getSelectedDocuments,
  upsertSelectedDocument,
} from "../nosql/document.nosql.js";

export const postChatController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { conversationId, message } = req.body;

  if (!message) {
    res.json({ err: "" });
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const chunk of getAnswer({ conversationId, message })) {
    res.write(JSON.stringify({ done: false, answer: chunk }) + "\n");
  }

  res.end();
};

export const postChatDocumentsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { filesIds, message } = req.body;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const { context, fileNames } = await queryDocuments({
    userId,
    filesIds,
    message,
  });

  for await (const chunk of getAnswerByContext({
    context,
    message,
  })) {
    res.write(JSON.stringify({ done: false, answer: chunk }) + "\n");
  }

  const refs = context.map((c, i) => ({
    text: c,
    fileName: fileNames[i],
  }));

  res.end(JSON.stringify({ done: true, refs }));
};

export const getChatDocumentsController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.params;

  const files = await getDocuments({ userId });

  const selectedDocuments = await getSelectedDocuments(courseId);

  for (let f of files) {
    f.selected = selectedDocuments.includes(f.id);
  }

  res.json({ data: { files } });
};

export const postChatDocumentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId } = req.body;
  const { originalname: fileName, buffer } = req.file;

  const content = await readFile(fileName, buffer);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const { fileId } = await postDocument({
    userId,
    fileName,
    content,
    onProgress: ({ process, fileId, progress }) => {
      res.write(JSON.stringify({ process, progress, fileId, fileName }) + "\n");
    },
  });

  await upsertSelectedDocument(courseId, fileId, true);

  res.end(
    JSON.stringify({
      process: "FINISHED",
      progress: 100,
      fileId,
      fileName,
    }) + "\n"
  );
};

export const postChatSelectedDocumentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const { courseId, fileId, selected } = req.body;

  await upsertSelectedDocument(courseId, fileId, selected);

  res.json({ data: { fileId } });
};

export const delChatDocumentController = async (req, res) => {
  const { id: userId, languageId } = req.user;
  const fileId = req.params.id;

  const data = await delDocument({ userId, fileId });

  await delSelectedDocuments(fileId);

  res.json({ data });
};

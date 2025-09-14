import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  postChatController,
  postChatDocumentsController,
  delChatDocumentController,
  getChatDocumentsController,
  postChatDocumentController,
  postChatSelectedDocumentController,
} from "../controllers/ai.chat.controller.js";

import { upload } from "../middlewares/file.middleware.js";

const router = Router();

router.post("", authMiddleware, postChatController);

router.post("/documents", authMiddleware, postChatDocumentsController);
router.get("/document/:courseId", authMiddleware, getChatDocumentsController);
router.post(
  "/document/selected",
  authMiddleware,
  postChatSelectedDocumentController
);

router.post(
  "/document",
  authMiddleware,
  upload.single("file"),
  postChatDocumentController
);
router.delete(
  "/document/:id",
  authMiddleware,
  upload.single("file"),
  delChatDocumentController
);

export default router;

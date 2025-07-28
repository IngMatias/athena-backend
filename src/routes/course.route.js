import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  postCourseController,
  getTagsController,
  getCourseDetailsController,
  postCourseDetailsController,
  delCourseController,
  postCourseContentController,
  postCourseImageController,
  getCourseImageController,
  getCourseSectionsController,
  postEnrollmentController,
  getEnrollmentController,
  getCourseContentController,
  postAnswerController,
} from "../controllers/course.controller.js";

import { upload } from "../middlewares/file.middleware.js";

const router = Router();

router.post("", authMiddleware, postCourseController);
router.post("/details", authMiddleware, postCourseDetailsController);
router.get("/details/:courseId", authMiddleware, getCourseDetailsController);
router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  postCourseImageController
);
router.get("/image/:courseId", authMiddleware, getCourseImageController);

router.get("/:courseId/sections", authMiddleware, getCourseSectionsController);

router.get("/:courseId/section/:sectionId", authMiddleware, getCourseContentController)
router.post("/:courseId", authMiddleware, postCourseContentController);

router.delete("/:courseId", authMiddleware, delCourseController);

router.get("/tag", authMiddleware, getTagsController);

router.get("/:courseId/enrollment", authMiddleware, getEnrollmentController);
router.post("/:courseId/enrollment", authMiddleware, postEnrollmentController);

router.post("/:courseId/section/:sectionId/content/:contentId", authMiddleware, postAnswerController)

export default router;

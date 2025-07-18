import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  postCourseController,
  getTagsController,
  getCourseDetailsController,
  postCourseDetailsController,
  delCourseController,
  postCourseContentController,
} from "../controllers/course.controller.js";

const router = Router();

router.post("", authMiddleware, postCourseController);
router.post("/details", authMiddleware, postCourseDetailsController);
router.get("/details/:courseId", authMiddleware, getCourseDetailsController);

router.post("/:courseId", authMiddleware, postCourseContentController );

router.delete("/:courseId", authMiddleware, delCourseController);

router.get("/tag", authMiddleware, getTagsController);

export default router;

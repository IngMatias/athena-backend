import { Router } from "express";

import { getCoursesByUserController, getCoursesController } from "../controllers/courses.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("", getCoursesController);
router.get("/user", authMiddleware, getCoursesByUserController);

export default router;

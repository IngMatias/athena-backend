import { Router } from "express";
import { getCourseImageController } from "../controllers/course.controller.js";

const router = Router();

router.get("/:imageUrl", getCourseImageController);

export default router;

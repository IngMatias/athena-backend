import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getVideoCaptionsController, getVideoController } from "../controllers/video.controller.js";

const router = Router();

router.post("/", authMiddleware, getVideoController);

router.post("/captions", authMiddleware, getVideoCaptionsController);

export default router;

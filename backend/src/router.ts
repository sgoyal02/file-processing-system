import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router";
import { projectRouter } from "./modules/projects/project.router";

const router = Router();
router.use('/auth', authRouter);
router.use('/projects', projectRouter);
export {router as globalRouter};
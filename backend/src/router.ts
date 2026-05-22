import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router";
import { projectRouter } from "./modules/projects/project.router";
import { fileRouter } from "./modules/files/file.router";
import { jobRouter } from "./modules/jobs/job.router";

const router = Router();
router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/projects/:id/files', fileRouter)
router.use('/projects/:id/jobs', jobRouter);
export {router as globalRouter};
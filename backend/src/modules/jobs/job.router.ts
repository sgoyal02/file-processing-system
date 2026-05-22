import { Router } from "express";
import { jobController } from "./job.controller";


const router = Router({ mergeParams: true });
router.use('/', jobController.getAllByProject);

export {router as jobRouter}
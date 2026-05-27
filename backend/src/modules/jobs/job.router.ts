import { Router } from "express";
import { jobController } from "./job.controller";


const router = Router({ mergeParams: true });
router.get('/', jobController.getAllByProject);
router.post('/', jobController.create);
router.get('/:jobId/download', jobController.downloadZip);
router.get('/:jobId', jobController.getJobStatus);

export {router as jobRouter}
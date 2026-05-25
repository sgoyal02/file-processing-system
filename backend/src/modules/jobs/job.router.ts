import { Router } from "express";
import { jobController } from "./job.controller";


const router = Router({ mergeParams: true });
router.get('/', jobController.getAllByProject);
router.post('/', jobController.create);
router.use('/:jobId', jobController.getJobStatus);
router.use('/:jobId/download', jobController.downloadZip);

export {router as jobRouter}
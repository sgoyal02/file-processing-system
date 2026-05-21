import { Router } from "express";
import { projController } from "./project.controller";

const router = Router();
router.get('/', projController.getAll);
router.get('/:id', projController.getById);
router.post('/', projController.create);
router.delete('/:id', projController.delete)

export {router as projectRouter};
import { Router } from 'express';
import multer from 'multer';
import { fileController } from './file.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router({ mergeParams: true });

router.get('/', fileController.getByProject);
router.post('/', upload.single('file'), fileController.upload);
router.delete('/:fileId', fileController.delete);

export { router as fileRouter };
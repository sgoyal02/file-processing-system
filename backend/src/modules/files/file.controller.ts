import { Request, Response } from 'express';
import { fileService } from './file.service';
import { sendError, sendSuccess } from '../../response';

export const fileController = {
  getByProject: async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const files = await fileService.getByProj(id);
      sendSuccess(res, files, 'Files fetch success', 200);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : 'Failed to fetch files', 500);
    }
  },

  upload: async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!req.file) {
      sendError(res, 'No file provided', 400);
      return;
    }
    try {
      const file = await fileService.uploadFile(id, req.file);
      sendSuccess(res, file, 'File uploaded', 201);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : 'Upload failed', 500);
    }
  },

  delete: async (req: Request, res: Response) => {
    const fileId = req.params.fileId as string;
    try {
      await fileService.deleteFile(fileId);
      sendSuccess(res, null, 'File deleted', 200);
    } catch (err) {
      console.log("file err api: ", err)
      const errMsg = err instanceof Error ? err.message : '';
      const code = errMsg === 'File not found.' ? 404 : 500;
      sendError(res, errMsg || 'Delete failed', code);
    }
  }
};
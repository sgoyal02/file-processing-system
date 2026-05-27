import { fileRepo } from './file.repository';
// import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const fileService = {
  getByProj: async (projectId: string) => {
    return await fileRepo.findByProj(projectId);
  },

  uploadFile: async (projectId: string, file: Express.Multer.File) => {
    // const id = randomUUID();
    // store-- uplaods/projectId/filename
    const projectDir = path.join(UPLOAD_DIR, projectId);
    await fs.mkdir(projectDir, { recursive: true });
    const filePath = path.join(projectDir, file.originalname);
    await fs.writeFile(filePath, file.buffer);
   
  //- on err still saving in folder?? check-- 
    // return await fileRepo.create({
    //   name: file.originalname,
    //   filePath: filePath,     //store path in app
    //   type: file.mimetype,
    //   size: file.size,
    //   projectId,
    // });
    try {
    return await fileRepo.create({
      name: file.originalname,
      filePath, type: file.mimetype,
      size: file.size, projectId,
    });
  } catch (err) {
    await fs.unlink(filePath).catch(() => {});
    throw err;
  }
  },

  deleteFile: async (id: string) => {
    const file = await fileRepo.delete(id);
    if (!file) throw new Error('File not found.');
    //disk del
    await fs.unlink(file.filePath).catch(() => {
      console.warn(`File not found on disk: ${file.filePath}`);
    });
    return true;
  }
};
import { Request, Response } from "express";
import { jobService } from "./job.service";
import { sendError, sendSuccess } from "../../response";
import path from "path";
import fs from 'fs';

const zipDir= path.join(process.cwd(), 'zips');

export const jobController={
    getAllByProject:async(req:Request, res:Response)=>{
        const id= req.params.id as string;
        try{
            const jobsData= await jobService.getByProj(id);
            sendSuccess(res, jobsData, "Jobs fetch success.")
        }catch(err){
            sendError(res, err instanceof Error? err.message: 'Failed to fetch jobs', 500);
        }
    },

    getById:async(req: Request, res: Response)=> {
    const jobId = req.params.jobId as string;
    try {
      const job = await jobService.getById(jobId);
      sendSuccess(res, job, 'Job data fetch success.');
    } catch (err) {
      const msg = err instanceof Error? err.message : '';
      sendError(res, msg || 'Failed to fetch job', msg === 'Job not found.' ?404: 500);
    }
  },

  create:async(req: Request, res: Response)=> {
    const id = req.params.id as string;
    const {fileIds} = req.body as {fileIds: string[]};
    if (!fileIds?.length) {
      sendError(res, 'files not selected yet', 400);
      return;
    }
    try {
    const job = await jobService.createZipJob(id, fileIds);
    sendSuccess(res, job, 'Job create success.', 201);
    } catch (err) {
      sendError(res, err instanceof Error? err.message: 'Failed to create job', 500);
    }
  },

  getJobStatus:async(req: Request, res: Response)=> {    //polling func
    const jobId= req.params.jobId as string;
    try {
    const job = await jobService.getById(jobId);
    sendSuccess(res, job, 'Job status fetch');
    } catch (err) {
    sendError(res, err instanceof Error? err.message: 'Failed to fetch job status', 500);
    }
  },

   downloadZip:async(req: Request, res: Response)=> {
    const jobId = req.params.jobId as string;
    try {
      const job = await jobService.getById(jobId);
      if (job.status!== 'COMPLETED') {
        sendError(res, 'Job in progress, not done.', 400);
        return;
      }
      const zipPath = path.join(zipDir, job.projectId.toString(), `job-${jobId}.zip`);
       const exists = await fs.promises.access(zipPath).then(() => true).catch(() => false);
    if (!exists) {
      sendError(res, 'Zip no longer exists.', 404);
      return;
    }
      res.download(zipPath, `job-${jobId}.zip`, (err)=>{
        if(err){
          sendError(res, 'Download failed.', 500);
        }
      });
    } catch (err) {
      sendError(res, err instanceof Error? err.message: 'Download fail', 500);
    }
  }
}
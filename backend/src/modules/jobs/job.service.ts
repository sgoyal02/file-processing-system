import path from "path";
import { fileRepo } from "../files/file.repository";
import { jobRepo } from "./job.repository";
import { Worker } from "worker_threads";
import { createZip } from "./zip.worker";

const zipDir= path.join(process.cwd(), 'zips');

export const jobService={
    getByProj: async(projectId:string)=>{
        return await jobRepo.findJobsByProj(projectId);
    },

    getById: async(id:string) => {
        const job = await jobRepo.findById(id);
        if (!job) throw new Error('Job not found.');
        return job;
  },

  createZipJob: async(projectId:string, fileIds:string[]) => {
    if (!fileIds.length) throw new Error('No files selected yet.');
    const job = await jobRepo.create(projectId, fileIds);
    (async () => {
      await jobRepo.updateStatus(job.id, {status:'PROCESSING',progress:0});
      const filesData:{path:string; name:string }[] = [];
      for (const fileId of fileIds) {
        const file = await fileRepo.findById(fileId.toString());
        console.log("filef etch: ", file);
        if (file) 
        filesData.push({path:file.filepath, name:file.name });
      }
      console.log("zip cretion filesData: ", filesData);
      if (!filesData.length) {
        await jobRepo.updateStatus(job.id, {status:'FAILED', progress:0 });
        return;
      }
      const outPath = path.join(zipDir,projectId,`job-${job.id}.zip`);
    //worker set
    return new Promise<void>((resolve, reject) => {
    const zipFIlePath= path.join(__dirname, 'zip.worker.ts');
    createZip();
    const worker= new Worker(zipFIlePath, {workerData:{jobId:job.id,filesData, outPath } });

    worker.on('message', async (msg) => {
      if (msg.type === 'progress') {
        await jobRepo.updateStatus(job.id, {
          status: 'PROCESSING',
          progress: msg.progress
        });
      } else if (msg.type === 'done') {
        console.log("done msg worker: ", msg);
        const url=`/api/projects/${projectId}/jobs/${job.id}/download`; //url add
      await jobRepo.updateStatus(job.id, {
        status: 'COMPLETED',
        progress: 100,
          downloadUrl:url,
          completedAt: new Date().toISOString()
        });
        resolve();
      } else if (msg.type=== 'error') {
        await jobRepo.updateStatus(job.id, { status: 'FAILED', progress: 0 });
        reject(new Error(msg.message));
      }
    });
    worker.on('error', async (err) => {
      await jobRepo.updateStatus(job.id, { status: 'FAILED', progress: 0 });
      reject(err);
    });
  });

    })().catch((err)=> console.error(`fail worker-job ${job.id}- `, err));
    return job;
  },
}

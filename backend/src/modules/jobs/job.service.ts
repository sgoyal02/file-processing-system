import { jobRepo } from "./job.repository"

export const jobService={
    getByProj: async(projectId:string)=>{
        return await jobRepo.findJobsByProj(projectId);
    },
}
import { Request, Response } from "express";
import { jobService } from "./job.service";
import { sendError, sendSuccess } from "../../response";

export const jobController={
    getAllByProject:async(req:Request, res:Response)=>{
        const id= req.params.id as string;
        try{
            const jobsData= await jobService.getByProj(id);
            sendSuccess(res, jobsData, "Jobs fetch success.")
        }catch(err){
            sendError(res, err instanceof Error ? err.message : 'Failed to fetch jobs', 500);
        }
    }
}
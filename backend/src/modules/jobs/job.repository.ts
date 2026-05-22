import { db } from "../../db"

export const jobRepo={
    findJobsByProj: async(projectId:string)=>{
       const queryTxt= `SELECT id, project_id as "projectId", file_ids as "fileIds",
        progress, status, download_url as "downloadUrl", created_at as "createdAt",
        completed_at as "completedAt" from jobs j where j.project_id=$1 ORDER BY created_at DESC`
       const res= await db.runQuery(queryTxt,[projectId]);
       return res.rows;
    }
}
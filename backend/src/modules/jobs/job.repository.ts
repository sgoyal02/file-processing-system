import { db } from "../../db"

export const jobRepo={
    findJobsByProj: async(projectId:string)=>{
       const queryTxt= `SELECT id, project_id as "projectId", file_ids as "fileIds",
        progress, status, download_url as "downloadUrl", created_at as "createdAt",
        completed_at as "completedAt" from jobs j where j.project_id=$1 ORDER BY created_at DESC`
       const res= await db.runQuery(queryTxt,[projectId]);
       return res.rows;
    },

    findById: async(id:string) => {
    const queryTxt = `SELECT id, project_id AS "projectId", file_ids AS "fileIds",
        progress, status, download_url AS "downloadUrl", created_at AS "createdAt", 
    completed_at AS "completedAt" FROM jobs WHERE id = $1`;
    const res = await db.runQuery(queryTxt, [id]);
    return res.rows[0] || null;
  },
    create: async(projectId:string, fileIds:string[]) => {
        const queryTxt = `INSERT INTO jobs(project_id,file_ids,status,progress,created_at)
        values ($1,$2,'PENDING',0,NOW())
        RETURNING id, project_id as "projectId", file_ids as "fileIds",
        progress, status, download_url AS "downloadUrl",
        created_at AS "createdAt", completed_at AS "completedAt"`;
    const res = await db.runQuery(queryTxt, [projectId, fileIds]);
    return res.rows[0];
  },

  updateStatus: async (id:number, data: {status: string; progress: number;
    downloadUrl?: string; completedAt?: string;}) => {
    const queryTxt = `UPDATE jobs SET status=$1, progress=$2, download_url=$3, completed_at=$4
      WHERE id=$5 RETURNING id, status, progress, download_url AS "downloadUrl", completed_at AS "completedAt"`;
    const res = await db.runQuery(queryTxt, [data.status, data.progress, 
        data.downloadUrl || null, data.completedAt || null, id]);
    return res.rows[0];
  }
}
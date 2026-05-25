import { db } from '../../db';

export const fileRepo = {
  findByProj:async(projectId:string) => {
    const queryTxt = `SELECT id, name, file_path AS "filePath", type, 
        size::int as size, project_id AS "projectId", uploaded_at AS "uploadedAt"
        FROM files WHERE project_id = $1 ORDER BY uploaded_at DESC`;
    const {rows} = await db.runQuery(queryTxt, [projectId]);
    return rows;
  },
  findById: async(id:string) => {
    const queryTxt = `SELECT id, name, file_path AS filePath FROM files WHERE id = $1`;
    const res = await db.runQuery(queryTxt,[id]);
    return res.rows[0] || null;
  },

  create: async(data:{name: string; filePath: string; type: string; size: number; projectId: string;}) => {
    const queryTxt = `INSERT INTO files (name, file_path, type, size, project_id, uploaded_at)
        VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING name, file_path AS "filePath", type,
        size, project_id AS "projectId", uploaded_at AS "uploadedAt"`;
    const {rows} = await db.runQuery(queryTxt, [data.name,data.filePath, data.type, data.size, data.projectId]);
    return rows[0];
  },

  delete: async (id: string) => {
    const queryTxt = `DELETE FROM files WHERE id = $1 RETURNING id, file_path AS "filePath"`;
    const {rows} = await db.runQuery(queryTxt, [id]);
    return rows[0] || null;
  }
};
import { db } from '../../db';

export const projectRepo = {
  findAll: async () => {
    const query= `SELECT p.id, p.name, p.description, p.created_at AS "createdAt",
        (SELECT COUNT(*)::int FROM files f WHERE f.project_id=p.id) AS "filesCount",
        (SELECT COUNT(*)::int FROM jobs j WHERE j.project_id=p.id) AS "jobsCount"
        FROM projects p ORDER BY p.created_at DESC`;
    const {rows} = await db.runQuery(query);
    console.log("rows: ", rows);
    return rows;
  },

  findById: async(id: string) => {
    const query= `SELECT p.id, p.name,p.description, p.created_at AS "createdAt",
        (SELECT COUNT(*)::int FROM files f WHERE f.project_id=p.id) AS "filesCount",
        (SELECT COUNT(*)::int FROM jobs j WHERE j.project_id=p.id) AS "jobsCount"
      FROM projects p WHERE p.id = $1`;
    const {rows} = await db.runQuery(query, [id]);
    return rows[0] || null;
  },

  create:async(name:string, description:string)=> {
    const query= `INSERT INTO projects(name, description, created_at) VALUES ($1, $2, NOW())
      RETURNING id, name, description, created_at AS "createdAt"`;
    const { rows } = await db.runQuery(query, [name, description]);
    return rows[0];
  },

  update:async(id:string, name:string, description:string) => {
  const queryTxt = `UPDATE projects SET name = $1, description = $2 WHERE id = $3 
      RETURNING id, name, description, created_at AS "createdAt"`;
  const res = await db.runQuery(queryTxt, [name, description, id]);
  return res.rows[0] || null;
},

  delete:async(id: string) => {
    const query= `DELETE FROM projects WHERE id = $1 RETURNING id`;
    const { rows } = await db.runQuery(query, [id]);
    return rows[0] || null;
  }
};
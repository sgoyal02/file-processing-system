import { db } from "../../db";

export const findUser=async(email:string)=>{
    const query='SELECT id, email, password, token from users WHERE email= $1 LIMIT 1';
    const { rows } = await db.runQuery(query, [email]);
    return rows[0] || null;
}
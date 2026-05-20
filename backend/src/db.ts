import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

export const dbPool= new Pool({connectionString: process.env.DB_URL});
export const db= {
 runQuery:(query:string, val?:any[]) => dbPool.query(query, val),
};

//dbPool connect try catch
//query run
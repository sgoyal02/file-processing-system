import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const isProd= process.env.NODE_ENV === 'production' || !!process.env.RENDER;

export const dbPool= new Pool({connectionString: process.env.DB_URL,
    ssl: !isProd ? false : {
    rejectUnauthorized: false //for rneder
  }
});
export const db= {
 runQuery:(query:string, val?:any[]) => dbPool.query(query, val),
};

//dbPool connect try catch
//query run
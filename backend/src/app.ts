import express, { Application } from "express";
import cors from 'cors';
import { dbPool } from "./db";
import { globalRoute } from './router';

const app:Application=express();

async function checkDbConnect(){
    try{
        const dbConnect= await dbPool.connect();
        console.log("db connection success:");
        dbConnect.release();
    }catch(err){
        console.error("db connection fail:", err);
    }
}
checkDbConnect();

app.use(cors())
app.use(express.json());
app.use('/api', globalRoute)
export default app;
import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';
import { dbPool } from "./db";
import {globalRouter } from './router';
import { sendError } from "./response";

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

// app.use(cors())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://file-processing-system-omega.vercel.app/'
  ]
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`--${req.method}: ${req.path}`);
    next();
});

app.use('/api', globalRouter)


//global err custom
app.use((err:any, req:Request, res:Response, next:NextFunction):void=>{
    console.error("global catch: ", err.stack, err.message);
  const code = err.statusCode|| 500;
    const msg = err.message||'Internal server error';
    sendError(res, msg, code);
})


export default app;
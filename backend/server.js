// const jsonServer = require("json-server");

// const app = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

// const PORT = process.env.PORT || 4000;
// app.use(middlewares);
// app.use(router);

// app.listen(PORT, "0.0.0.0", () => {
//   console.log("json Server running on port " + PORT);
// });


const express=require('express');
const cors=require('cors');
const path=require('path');
const fs=require('fs');
require('dotenv').config();

const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

//get all
app.get('/projects', async(req, res) => {
  try {
    const query = `SELECT p.*,
  (SELECT COUNT(*) FROM files f WHERE f.projectId = p.id) AS "filesCount",
  (SELECT COUNT(*) FROM jobs j WHERE j.projectId = p.id) AS "jobsCount"
  FROM projects p
  ORDER BY p.createdAt DESC`;
    const {rows} = await db.runQuery(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//add
app.post('/projects', async(req, res) => {
  try {
    const {name,description}= req.body;
    const queryTxt=`INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *`;
    const {rows} = await db.runQuery(queryTxt, [name, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT= process.env.PORT ||4000;
app.listen(PORT, ()=>{
  console.log("apis listening on  port: ",PORT);
})
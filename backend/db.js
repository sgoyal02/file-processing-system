const {Pool}= require('pg');
require('dotenv').config();

const dbPool= new Pool({connectionString: process.env.DB_URL});
module.exports = {
  runQuery: (query, val) => dbPool.query(query, val),
};
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "faizan..12",
  host: "localhost",
  port: "5432",
  database: "only_halal",
});

module.exports = pool;

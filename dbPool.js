const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "i0rgccmrx3at3wv3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "km8dsu4d1grrp3b8",
  password: "nbnupgaa4hc0e0fz",
  database: "wg4afj2gwmrmtqo7",
});

module.exports = pool;

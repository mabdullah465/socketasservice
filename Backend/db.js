import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "mysql-34e4c26a-abdullah457tu-418e.i.aivencloud.com",
  port:"21582",
  user: "avnadmin",
  password: "AVNS_dyWpB0sPm237dbewtU-",
  database: "socketservice",
});

export default db;
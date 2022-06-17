var mysql = require("mysql");

var db = mysql.createConnection({
  host: "172.17.3.159",
  user: "root",
  password: "1234",
  database: "musik",
});

db.connect();

module.exports = db;

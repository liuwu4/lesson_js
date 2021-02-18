const mysql = require("mysql");
const config = {
  host: "localhost",
  user: "root",
  password: "Y3liu4ba.",
  database: "country_area",
};
const mysqlFactory = mysql.createConnection(config);
const connected = function () {
  mysqlFactory.connect();
  return mysqlFactory;
};
exports.mysql = connected();

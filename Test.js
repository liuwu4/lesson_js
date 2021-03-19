const { mysql } = require('./db/mysql');
function test() {
  mysql.query('select * from province', function (err, rows, fiels) {
    console.log('====:', rows);
  });
}
test();

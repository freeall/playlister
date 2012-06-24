var fs = require('fs');
var DB_CONNECTION = ''+fs.readFileSync('dbpass.txt');
var db = require('mongojs').connect(DB_CONNECTION, ['tmp']);

db.tmp.find(console.log)
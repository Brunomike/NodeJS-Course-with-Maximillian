const mysql = require('mysql2');

const pool=mysql.createPool({
    host:'localhost',
    user:'root',    
    database:'node-complete',
    password:'##Dingili##11'
})

module.exports=pool.promise();
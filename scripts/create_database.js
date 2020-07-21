var mysql = require('mysql');
var dbconfig = require('../config/database1');
console.log(dbconfig.database);
var conn = mysql.createConnection(dbconfig.connection);

conn.query('CREATE DATABASE ' +dbconfig.database);
conn.query('USE DATABASE '+dbconfig.database);
conn.query("CREATE TABLE users (id INT UNSIGNED NOT NULL AUTO_INCREMENT, username varchar(100) UNIQUE NOT NULL, password varchar(250) NOT NULL , PRIMARY KEY (id))",function(err,result)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        // conn.query("CREATE TABLE data (id INT UNSIGNED NOT NULL, website varchar(100) NOT NULL, username varchar(100) NOT NULL,password varchar(250) NOT NULL, PRIMARY KEY(id,webiste), FOREIGN KEY (id) REFERENCES users(id))",function(err,res)
        // {
        //     if(err)
        //     {
        //         console.log(err);
        //     }
        //     else
        //     {
        //         console.log("Database Created ");
        //     }
        // });
    }
});

conn.end();
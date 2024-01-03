const mariadb = require('mariadb')
require('dotenv').config()

const pool = mariadb.createPool({
    host: process.env.DBHOST,
    database:process.env.DBNAME,
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD
});

module.exports = pool;
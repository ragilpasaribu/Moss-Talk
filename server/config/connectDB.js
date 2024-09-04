/* eslint-disable prettier/prettier */
const mysql = require('mysql2/promise');

async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB_NAME,
            port: process.env.MYSQL_PORT
        });

        console.log('Connect ke MySQL DB');
        return connection;

    } catch (error) {
        console.log('Sesuatu salah dengan MySQL', error);
    }
}

module.exports = connectDB;

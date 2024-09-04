/* eslint-disable prettier/prettier */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT || 3306,
    logging: false
});

module.exports = sequelize;

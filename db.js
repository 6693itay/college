const Sequelize = require("sequelize");
const dbUrl = require('./config')

const sequelize = new Sequelize(dbUrl,
{ define: { timestamps: false } }) //TO CHANGE
// "mysql://myuser:mypass@3.95.148.188:3306/college"

module.exports = sequelize;


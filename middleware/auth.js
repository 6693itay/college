const sequelize = require('../db');
const users = sequelize.import("../models/users.js");

module.exports = function (req, res, next) {
    let token = req.header("auth");
    users.findByToken(token)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err)=> res.status(401).send("Invalid token"));
}
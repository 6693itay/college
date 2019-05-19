const sequelize = require('../db');
const users = sequelize.import("../models/users.js");

module.exports = function (req, res, next) {
    let token = req.header("auth");
    users.findByToken(token).then((user) => {
        if (user.role != "teacher") {
            return res.sendStatus(401);
        }
        next();

    }).catch((err)=>res.sendStatus(401));



}
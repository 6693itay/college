/* jshint indent: 2 */
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const sequelize =require('../db');

const tokens = sequelize.import("tokens.js");

function hashPassword(user, options) {
  if (user.changed('password')) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          resolve(user);
        });
      });
    })
  }
  return Promise.resolve(user);
}
module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'username'
    },
    password: {
      type: DataTypes.STRING(225),
      allowNull: false,
      field: 'password'
    },
    id: {
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    role: {
      type: DataTypes.ENUM('teacher', 'student'),
      allowNull: false,
      field: 'role'
    }
  }, {
      hooks: {
        beforeUpdate: hashPassword,
        beforeCreate: hashPassword
      },
      tableName: 'users'
    });

  users.generateToken = async function (id) {
    var user = await users.findOne({ where: { id } });
    if (user) { 
      var token = jwt.sign({_id:id}, 'mysecret').toString();
      // var token = jwt.sign({_id:id}, process.env.secret ).toString();
      return tokens.create({ token, id })
    }
    throw new Error("User not found.");
  };
  users.findByToken = async function (token) {
    try {
      var decoded = jwt.verify(token, 'mysecret');
      var id = decoded._id;
      var userToken = await tokens.findOne({ where: { token, id } });
      if (userToken) {
        var user = await users.findByPk(userToken.id);
        return user;
      }
      
    }
    catch  {
      throw new Error("Invalid token");
    }
  }
  users.findByCredentials = async function (username, password) {
    var user = await users.findOne({ where: { username } });
    if (!user) {
     return Promise.reject("Incorrect credentials");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          resolve(user); 
        } else {
          reject("Incorrect credentials");
        }
      });
    });
  }
  return users;
};

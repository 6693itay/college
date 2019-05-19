/* jshint indent: 2 */
const sequelize = require('../db');

const users = sequelize.import("users.js");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('students', {
    id: {
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'Id'
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'Name'
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'PhoneNumber'
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'City'
    }
  }, {
      tableName: 'Students',
      hooks: {
        beforeCreate: function (student) {
          return users.create({ id: student.id, username: student.id, password: student.id, role:"student" });
        }
      }
    });
};

/* jshint indent: 2 */
const sequelize = require('../db');

const Courses = sequelize.import("courses.js");
const Students = sequelize.import("students.js");

module.exports = function (sequelize, DataTypes) {
  let attendances = sequelize.define('attendances', {
    courseId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'CourseId'
    },
    studentId: {
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Students',
        key: 'Id'
      },
      field: 'StudentId'
    },
    sessionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
      field: 'SessionDate'
    },
    attended: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      field: 'Attended'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'message'
    }
  }, {
      tableName: 'Attendances'
    });
  attendances.addNewAttendance = function (studentId, courseId, sessionDate) {
    return new Promise((resolve, reject) => {
      attendances.create({ courseId, studentId, sessionDate })
        .then((attendance) => resolve(attendance))
        .catch((err) => reject(err));
    });
  }
  return attendances;
};

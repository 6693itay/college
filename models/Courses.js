/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('courses', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    sun: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'sun'
    },
    mon: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'mon'
    },
    tue: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'tue'
    },
    wed: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'wed'
    },
    thu: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'thu'
    },
    fri: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'fri'
    },
    sat: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'sat'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'StartDate'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'EndDate'
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    }
  }, {
    tableName: 'Courses'
  });
};

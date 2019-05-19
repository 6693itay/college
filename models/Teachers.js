/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teachers', {
    id: {
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'name'
    }
  }, {
    tableName: 'Teachers'
  });
};

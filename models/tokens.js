/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    token: {
      type: DataTypes.STRING(225),
      allowNull: false,
      primaryKey: true,
      field: 'token'
    },
    id: {
      type: DataTypes.STRING(9),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'id'
    }
  }, {
    tableName: 'tokens'
  });
};

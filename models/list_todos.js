'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class list_todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  list_todos.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'list_todos',
  });
  return list_todos;
};

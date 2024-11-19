'use strict';
//创建新模型的指令 sequelize model:generate --name Forms --attributes lable:string,value:text
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Forms.init({
    lable: DataTypes.STRING,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Forms',
  });
  return Forms;
};
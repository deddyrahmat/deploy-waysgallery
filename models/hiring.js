'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hiring extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hiring.belongsTo(models.User,{
        as : "orderby" ,foreignKey: "orderBy"
      });

      Hiring.belongsTo(models.User,{
        as : "orderto" ,foreignKey: "orderTo"
      });

      Hiring.hasOne(models.Project,{
        as:"project", foreignKey: "id"
      })
    }
  };
  Hiring.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.INTEGER,
    orderBy: DataTypes.INTEGER,
    orderTo: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hiring',
  });
  return Hiring;
};
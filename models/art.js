'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Art extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Art.belongsTo(models.User,{
        as : "user" , foreignKey: 'userId'
      })
    }
  };
  Art.init({
    userId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Art',
  });
  return Art;
};
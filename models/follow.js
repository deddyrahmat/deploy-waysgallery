'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User,{
        as : "followings" ,foreignKey: "following"
      });

      Follow.belongsTo(models.User,{
        as : "follower" ,foreignKey: "followers"
      });
    }
  };
  Follow.init({
    following: DataTypes.INTEGER,
    followers: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};
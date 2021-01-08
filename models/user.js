'use strict';
const {
  Model, Transaction
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post,{
        as : "posts", foreignKey: 'createdBy'
      });
      User.hasMany(models.Art,{
        as : "arts", foreignKey: 'userId'
      });
      User.hasMany(models.Hiring, {
        foreignKey: 'id'
      });

      User.hasMany(models.Follow,{
        foreignKey : 'following'
      });
      User.hasMany(models.Follow,{
        as : "followers",  foreignKey : 'followers'
      });
    }
  };
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    greeting: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FileProject.belongsTo(models.Project, {
        foreignKey:"projectId"
      })
    }
  };
  FileProject.init({
    projectId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FileProject',
  });
  return FileProject;
};
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  post.init({
    description: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};

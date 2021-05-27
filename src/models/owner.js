const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class owner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  owner.init({
    id_user: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'owner',
  });
  return owner;
};

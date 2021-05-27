const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  usuario.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    userpicture: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'usuario',
  });

  return usuario;
};

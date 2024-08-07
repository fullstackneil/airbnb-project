'use strict';
const { Model, Validator, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Spot, {foreignKey: 'ownerId', onDelete: 'CASCADE'})
      User.hasMany(models.Booking, {foreignKey: 'userId'})
      User.hasMany(models.Review, {foreignKey: 'userId', onDelete: 'CASCADE'})
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 15]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 15]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 256],
          msg: "Email length must be between 3 and 256 characters"
        },
        isEmail: {
          args: true,
          msg: "Please enter a valid email address"
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: [
          "hashedPassword",
          "email",
          "username",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    scopes: {
      findUser(credential) {
        return {
          where: {
            [Op.or]: {
              email: credential,
              username: credential,
            },
          },
        };
      },
    },
  });
  return User;
};

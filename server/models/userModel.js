/* eslint-disable prettier/prettier */
const {DataTypes} = require('sequelize');
const sequelize = require('../config/Sequelizes');
const {v4: uuidv4} = require('uuid'); // Import UUID v4

// User Model
const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Secara otomatis akan menggunakan UUID v4
      primaryKey: true, // Jadikan id sebagai primary key
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_pic: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = UserModel;

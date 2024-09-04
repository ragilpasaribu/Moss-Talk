/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Sequelizes');
const UserModel = require('./userModel');

// Conversation Model
const ConversationModel = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = ConversationModel;

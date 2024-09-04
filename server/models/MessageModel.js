/* eslint-disable prettier/prettier */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Sequelizes');
const ConversationModel = require('./CoversationModel');
const UserModel = require('./userModel');

// Message Model
const MessageModel = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    msgByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ConversationModel,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = MessageModel;

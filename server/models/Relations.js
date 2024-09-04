/* eslint-disable prettier/prettier */
const UserModel = require('./userModel');
const ConversationModel = require('./CoversationModel');
const MessageModel = require('./MessageModel');

// Relasi antara User dan Conversation
UserModel.hasMany(ConversationModel, { foreignKey: 'senderId', as: 'sentConversations' });
UserModel.hasMany(ConversationModel, { foreignKey: 'receiverId', as: 'receivedConversations' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'senderId', as: 'sender' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'receiverId', as: 'receiver' });

// Relasi antara Conversation dan Message
ConversationModel.hasMany(MessageModel, { foreignKey: 'conversationId', as: 'messages' });
MessageModel.belongsTo(ConversationModel, { foreignKey: 'conversationId' });

// Relasi antara Message dan User
UserModel.hasMany(MessageModel, { foreignKey: 'msgByUserId', as: 'messages' });
MessageModel.belongsTo(UserModel, { foreignKey: 'msgByUserId', as: 'author' });

module.exports = {
  UserModel,
  ConversationModel,
  MessageModel,
};

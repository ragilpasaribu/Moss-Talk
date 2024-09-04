/* eslint-disable prettier/prettier */
const UserModel = require('../models/userModel');
const ConversationModel = require('../models/CoversationModel');
const MessageModel = require('../models/MessageModel');
const {Op} = require('sequelize');

const getPercakapan = async currentUserId => {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.findAll({
      where: {
        [Op.or]: [{senderId: currentUserId}, {receiverId: currentUserId}],
      },
      order: [['updatedAt', 'DESC']],
      include: [
        {model: MessageModel, as: 'messages'},
        {model: UserModel, as: 'sender'},
        {model: UserModel, as: 'receiver'},
      ],
    });

    const conversation = currentUserConversation.map(conv => {
      const unseenMsg = conv?.messages?.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return prev + (curr?.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      return {
        id: conv?.id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: unseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

module.exports = getPercakapan;

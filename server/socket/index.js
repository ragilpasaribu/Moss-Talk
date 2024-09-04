/* eslint-disable prettier/prettier */
const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const sequelize = require('../config/Sequelizes');
const UserModel = require('../models/userModel');
const ConversationModel = require('../models/CoversationModel');
const MessageModel = require('../models/MessageModel');
const getUserDetailsFromToken = require('../helpers/GetUserDetailFromToken');
const {Op} = require('sequelize');
const getPercakapan = require('../helpers/GetConversation');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Menghubungkan ke database
sequelize
  .authenticate()
  .then(() => {
    console.log('Koneksi berhasil dibuat.');
    return sequelize.sync({alter: true});
  })
  .then(() => {
    console.log('Model berhasil disinkronkan.');
  })
  .catch(err => {
    console.error('Tidak dapat terhubung ke database:', err);
  });

const onlineUser = new Set();

io.on('connection', async socket => {
  console.log('Pengguna Terhubung', socket.id);

  const token = socket.handshake.auth.token;

  // Mendapatkan detail pengguna dari token
  const user = await getUserDetailsFromToken(token);

  if (user?.id) {
    socket.join(user?.id?.toString());
    onlineUser.add(user?.id?.toString());
  }

  io.emit('onlineUser', Array.from(onlineUser));

  socket.on('message-page', async userId => {
    try {
      const userIdString = userId.toString();
      const isOnline = onlineUser.has(userIdString);

      const userDetail = await UserModel.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'profile_pic'],
      });

      if (userDetail) {
        const payload = {
          id: userDetail.id,
          name: userDetail.name,
          email: userDetail.email,
          profile_pic: userDetail.profile_pic,
          online: isOnline,
        };

        socket.emit('message-user', payload);

        const getConverSationMessage = await ConversationModel.findOne({
          where: {
            [Op.or]: [
              {senderId: user?.id, receiverId: userId},
              {senderId: userId, receiverId: user?.id},
            ],
          },
          include: [
            {
              model: MessageModel,
              as: 'messages',
            },
          ],
          order: [[{model: MessageModel, as: 'messages'}, 'createdAt', 'ASC']],
        });

        if (getConverSationMessage && getConverSationMessage.messages) {
          io.to(user.id.toString()).emit(
            'pesan',
            getConverSationMessage.messages,
          );
          io.to(userIdString).emit('pesan', getConverSationMessage.messages);
        } else {
          console.log('Percakapan tidak ditemukan atau tidak ada pesan.');
        }
      }
    } catch (error) {
      console.error('Error pada event message-page:', error);
    }
  });

  socket.on('pesan baru', async data => {
    try {
      let conversation = await ConversationModel.findOne({
        where: {
          [Op.or]: [
            {senderId: data?.sender, receiverId: data?.receiver},
            {senderId: data?.receiver, receiverId: data?.sender},
          ],
        },
      });

      if (!conversation) {
        conversation = await ConversationModel.create({
          senderId: data.sender,
          receiverId: data.receiver,
        });
      }

      const message = await MessageModel.create({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        conversationId: conversation.id,
        msgByUserId: data.msgByUserId,
      });

      await conversation.update({updatedAt: new Date()});

      const getConverSationMessage = await ConversationModel.findOne({
        where: {id: conversation.id},
        include: [
          {
            model: MessageModel,
            as: 'messages',
          },
        ],
        order: [[{model: MessageModel, as: 'messages'}, 'createdAt', 'ASC']],
      });

      if (getConverSationMessage && getConverSationMessage.messages) {
        io.to(data?.sender.toString()).emit(
          'pesan',
          getConverSationMessage.messages,
        );
        io.to(data?.receiver.toString()).emit(
          'pesan',
          getConverSationMessage.messages,
        );

        const kirimObrolan = await getPercakapan(data?.sender);
        const terimaObrolan = await getPercakapan(data?.receiver);

        io.to(data?.sender.toString()).emit('Percakapan', kirimObrolan);
        io.to(data?.receiver.toString()).emit('Percakapan', terimaObrolan);
      } else {
        console.log('Pesan tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error pada event pesan baru:', error);
    }
  });

  socket.on('sidebar', async currentUserId => {
    const ngobrol = await getPercakapan(currentUserId);
    socket.emit('Percakapan', ngobrol);
  });

  socket.on('seen', async msgByUserId => {
    try {
      let conversation = await ConversationModel.findOne({
        where: {
          [Op.or]: [
            {senderId: user?.id, receiverId: msgByUserId},
            {senderId: msgByUserId, receiverId: user?.id},
          ],
        },
        include: [{model: MessageModel, as: 'messages'}],
      });

      const conversationMessageId =
        conversation?.messages?.map(msg => msg.id) || [];

      await MessageModel.update(
        {seen: true},
        {
          where: {
            id: conversationMessageId,
            msgByUserId: msgByUserId,
          },
        },
      );

      const kirimObrolan = await getPercakapan(user?.id?.toString());
      const terimaObrolan = await getPercakapan(msgByUserId.toString());

      io.to(user?.id?.toString()).emit('Percakapan', kirimObrolan);
      io.to(msgByUserId.toString()).emit('Percakapan', terimaObrolan);
    } catch (error) {
      console.error('Error pada event seen:', error);
    }
  });

  socket.on('edit-message', async data => {
    try {
      const {messageId, newText} = data;

      // Update pesan di database
      const updatedMessage = await MessageModel.update(
        {text: newText},
        {where: {id: messageId}},
      );

      if (updatedMessage[0] > 0) {
        const conversation = await ConversationModel.findOne({
          where: {id: data.conversationId},
          include: [{model: MessageModel, as: 'messages'}],
          order: [[{model: MessageModel, as: 'messages'}, 'createdAt', 'ASC']],
        });

        io.to(data.sender.toString()).emit('pesan', conversation.messages);
        io.to(data.receiver.toString()).emit('pesan', conversation.messages);
      } else {
        console.error('Pesan tidak ditemukan atau tidak dapat diperbarui.');
      }
    } catch (error) {
      console.error('Error pada event edit-message:', error);
    }
  });

  socket.on('delete-message', async data => {
    try {
      const {messageId, conversationId, sender, receiver} = data;
      console.log('Data diterima:', data);

      // Hapus pesan dari database
      await MessageModel.destroy({where: {id: messageId}});
      console.log('Pesan berhasil dihapus:', messageId);

      // Cek apakah percakapan masih ada setelah penghapusan pesan
      const conversation = await ConversationModel.findOne({
        where: {id: conversationId},
        include: [{model: MessageModel, as: 'messages'}],
        order: [[{model: MessageModel, as: 'messages'}, 'createdAt', 'ASC']],
      });

      if (conversation && conversation.messages.length > 0) {
        console.log('Percakapan ditemukan:', conversationId);
        io.to(sender).emit('pesan', conversation.messages);
        io.to(receiver).emit('pesan', conversation.messages);
      } else {
        console.log(
          'Percakapan tidak ditemukan atau tidak ada pesan yang tersisa.',
        );

        // Jika tidak ada pesan yang tersisa, kamu bisa menghapus percakapan
        if (conversation) {
          await ConversationModel.destroy({where: {id: conversationId}});
          console.log('Percakapan dihapus:', conversationId);
        }

        // Emit event untuk memberi tahu bahwa percakapan telah dihapus
        io.to(sender).emit('percakapanDihapus', conversationId);
        io.to(receiver).emit('percakapanDihapus', conversationId);
      }
    } catch (error) {
      console.error('Error pada event delete-message:', error);
    }
  });

  socket.on('disconnect', () => {
    if (user?.id) {
      onlineUser.delete(user.id.toString());
    }
    console.log('Pengguna Tidak Terhubung', socket.id);
  });
});

module.exports = {
  app,
  server,
};

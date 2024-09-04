/* eslint-disable prettier/prettier */
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const UserModel = require('./models/userModel');
const ConversationModel = require('./models/CoversationModel');
const MessageModel = require('./models/MessageModel');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const {app, server} = require('./socket/index');

// Import file untuk mengatur relasi model
require('./models/Relations');

// const app = express();

app.use(express.json());
app.use(cookiesParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Koneksi ke database dan sinkronisasi tabel
(async () => {
  try {
    await UserModel.sync();
    await ConversationModel.sync();
    await MessageModel.sync();
    console.log('Database & tables created!');

    await connectDB();
    console.log('Connect ke MySQL DB');

    // Daftarkan rute setelah sinkronisasi database
    app.use('/api', router);

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log('Server berjalan di ' + PORT);
    });
  } catch (error) {
    console.log('Database sync or connection error:', error);
  }
})();

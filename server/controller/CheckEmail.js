/* eslint-disable prettier/prettier */
const mysql = require('mysql2/promise');
const connectDB = require('../config/connectDB'); // Pastikan Anda memiliki koneksi yang benar

async function checkEmail(request, response) {
  try {
    const { email } = request.body;

    // Membuat koneksi ke database
    const connection = await connectDB();

    // Membuat query untuk memeriksa apakah email sudah ada
    const [rows] = await connection.execute(
      'SELECT id, name, email, profile_pic, createdAt, updatedAt FROM users WHERE email = ?',
      [email]
    );

    // Menutup koneksi
    await connection.end();

    if (rows.length === 0) {
      return response.status(400).json({
        message: 'Pengguna tidak ditemukan',
        error: true,
      });
    }

    return response.status(200).json({
      message: 'Email terverifikasi',
      success: true,
      data: rows[0], // Mengembalikan pengguna pertama yang ditemukan
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkEmail;

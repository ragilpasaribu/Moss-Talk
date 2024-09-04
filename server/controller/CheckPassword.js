/* eslint-disable prettier/prettier */
const UserModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* eslint-disable prettier/prettier */
async function checkPassword(request, response) {
    try {
        const { password, userId } = request.body;

        // Cari user berdasarkan ID menggunakan Sequelize
        const user = await UserModel.findByPk(userId);

        // Jika user tidak ditemukan
        if (!user) {
            return response.status(400).json({
                message: 'User tidak ditemukan',
                error: true
            });
        }

        // Verifikasi password yang diinput dengan password yang ada di database
        const verifyPassword = await bcryptjs.compare(password, user.password);

        if (!verifyPassword) {
            return response.status(400).json({
                message: 'Tolong periksa password anda',
                error: true
            });
        }

        // Siapkan data untuk token
        const tokenData = {
            id: user.id,
            email: user.email
        };

        // Buat JWT token
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Opsi untuk cookie
        const cookieOption = {
            httpOnly: true,
            secure: true,
        };

        // Kirim token dalam cookie dan response JSON
        return response.cookie('token', token, cookieOption).status(200).json({
            message: 'Login sukses',
            token: token,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = checkPassword;

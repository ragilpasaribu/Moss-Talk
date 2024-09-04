/* eslint-disable prettier/prettier */
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const getUserDetailsFromToken = async(token) => {
    if (!token) {
        return {
            message: 'Sesi berakhir',
            logout: true
        };
    }

    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findByPk(decode.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return {
                message: 'User tidak ditemukan',
                logout: true
            };
        }

        return user;
    } catch (error) {
        return {
            message: error.message || 'Token tidak valid',
            logout: true
        };
    }
};

module.exports = getUserDetailsFromToken;

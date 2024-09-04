/* eslint-disable prettier/prettier */
const { Sequelize } = require('sequelize');
const sequelize = require('../config/Sequelizes');
const UserModel = require('../models/userModel');

async function userSearch(request, response) {
    try {
        const { search } = request.body;

        // Gunakan operator Sequelize untuk pencarian "LIKE"
        const user = await UserModel.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { name: { [Sequelize.Op.like]: `%${search}%` } },
                    { email: { [Sequelize.Op.like]: `%${search}%` } }
                ]
            }
        });

        return response.json({
            message: 'All users retrieved successfully',
            data: user,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = userSearch;

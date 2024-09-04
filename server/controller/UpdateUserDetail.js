/* eslint-disable prettier/prettier */
const getUserDetailsFromToken = require("../helpers/GetUserDetailFromToken");
const UserModel = require("../models/userModel");

/* eslint-disable prettier/prettier */
async function updateUserDetail(request, response) {
    try {
        const token = request.cookies.token || "";
        const user = await getUserDetailsFromToken(token);

        const { name, profile_pic } = request.body;

        // Update user menggunakan Sequelize
        const updateUser = await UserModel.update(
            { name, profile_pic },  // Data yang akan diupdate
            { where: { id: user.id } }  // Kondisi untuk update, berdasarkan ID user
        );

        // Ambil kembali informasi user yang telah diperbarui
        const userInformation = await UserModel.findByPk(user.id, {
            attributes: { exclude: ['password'] } // Menghapus kolom password dari hasil query
        });

        return response.json({
            message: 'Berhasil Mengupdate User',
            data: userInformation,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = updateUserDetail;

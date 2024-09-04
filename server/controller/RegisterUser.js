/* eslint-disable prettier/prettier */
const UserModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
/* eslint-disable prettier/prettier */
async function registerUser(request, response) {
  try {
    const {name, email, password, profile_pic} = request.body;

    const checkEmail = await UserModel.findOne({where: {email}});

    if (checkEmail) {
      return response.status(400).json({
        message: 'pengguna sudah ada',
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashPassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return response.status(201).json({
      message: 'Berhasil membuat akun',
      data: userSave,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = registerUser;

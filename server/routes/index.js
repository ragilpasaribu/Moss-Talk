/* eslint-disable prettier/prettier */
const express = require('express');
const registerUser = require('../controller/RegisterUser');
const checkEmail = require('../controller/CheckEmail');
const checkPassword = require('../controller/CheckPassword');
const logout = require('../controller/LogOut');
const userDetails = require('../controller/UserDetail');
const updateUserDetail = require('../controller/UpdateUserDetail');
const userSearch = require('../controller/SearchUser');

const router = express.Router();

router.post('/register', registerUser);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.get('/logout', logout);
router.get('/user-detail', userDetails);
router.put('/update-user', updateUserDetail);
router.post('/search-user', userSearch);

module.exports = router;

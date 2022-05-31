const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/user.controller');
const { userSignupValidator } = require('../validator/index.validator');

router.post('/signup', userSignupValidator, signup);

module.exports = router;
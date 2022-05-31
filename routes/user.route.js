const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/user.controller');
const { userSignupValidator } = require('../validator/index.validator');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);

module.exports = router;
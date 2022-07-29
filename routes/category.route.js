const express = require('express');
const router = express.Router();

const { create, categoryById, read } = require('../controllers/category.controller');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth.controller');
const { userById } = require('../controllers/user.controller');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
const express = require('express');
const router = express.Router();

const { create, productById, read, remove } = require('../controllers/product.controller');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth.controller');
const { userById } = require('../controllers/user.controller');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
// router.delete('/product/delete/test', remove);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
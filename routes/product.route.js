const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo } = require('../controllers/product.controller');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth.controller');
const { userById } = require('../controllers/user.controller');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);

router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);

router.get('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
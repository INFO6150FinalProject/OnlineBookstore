const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { create, productById, read, remove, update } = require('../controllers/product')

router.get('/product/:productId', read);
router.post('/product/create/:userId', userById, requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', userById, requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', userById, requireSignin, isAuth, isAdmin, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
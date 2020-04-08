const express = require('express');
const router = express.Router();
const { userById } = require('../controllers/user')

router.param('userId', userById);

module.exports = router;
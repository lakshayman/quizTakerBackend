const express = require('express');
const router = express.Router();
const { login, signup, abc } = require('../controllers');
router.post('/login', login);
router.post('/addUser', signup);

module.exports = router;
var express = require('express');
var router = express.Router();

const message_controller = require('../controllers/messageController');
const user_controller = require('../controllers/userController');

//+ home page
router.get('/', message_controller.index);

//+ login page
router.get('/login', user_controller.login);

//+ sign up page
router.get('/sign-up', user_controller.signup);

module.exports = router;

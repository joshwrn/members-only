var express = require('express');
var router = express.Router();

const message_controller = require('../controllers/messageController');
const user_controller = require('../controllers/userController');

//+ home page
router.get('/', message_controller.index);

//+ login page
router.get('/login', user_controller.login_get);

// login post request
// router.post('/login', user_controller.login_post);

//+ sign up page
router.get('/sign-up', user_controller.signup_get);

// sign up post request
router.post('/sign-up', user_controller.signup_post);

module.exports = router;

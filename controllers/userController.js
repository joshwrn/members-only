const async = require('async');

//+ Login Page
exports.login = function (req, res) {
  res.render('user_login', { title: 'Login' });
};

//+ Sign Up Page
exports.signup = function (req, res) {
  res.render('user_signup', { title: 'Sign Up' });
};

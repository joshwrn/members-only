const async = require('async');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const User = require('../models/userModel');

//+ Login Page

//$ get
exports.login_get = function (req, res) {
  res.render('user_login', { title: 'Login' });
};

//$ post
exports.login_post = function (req, res) {
  console.log('test');
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log('error');
          return done(err);
        }
        if (!user) {
          console.log('no user');
          return done(null, false, { message: 'Incorrect username' });
        }
        if (user.password !== password) {
          console.log('pass idk');
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              console.log('pass match');
              // passwords match! log user in
              return done(null, user);
            } else {
              console.log('pass doesnt match');
              // passwords do not match!
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        }
        return done(null, user);
      });
    })
  );

  console.log('next');

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  });

  console.log('last');
};

//+ Sign Up Page

//$ signup GET
exports.signup_get = function (req, res) {
  res.render('user_signup', { title: 'Sign Up' });
};

//$ signup POST
exports.signup_post = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    // otherwise, store hashedPassword in DB
    if (req.body.password !== req.body.confirmPassword) return res.redirect('/sign-up');
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((error) => {
      if (error) {
        return next(error);
      }
      res.redirect('/login');
    });
  });
};

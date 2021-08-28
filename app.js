var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
require('dotenv').config();

const User = require('./models/userModel');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//$ MongoDB setup
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//$ view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//$ passport functions
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//$ login function
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

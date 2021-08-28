const async = require('async');

const { body, validationResult } = require('express-validator');

const Message = require('../models/messageModel');
const User = require('../models/userModel');

//$ get messages for home page
exports.index = async function (req, res) {
  try {
    const messages = await Message.find({}).populate('user').exec();
    // console.log(messages);
    console.log('user', req.user);
    res.render('index', { title: 'Home', user: req.user, messages: messages.reverse() });
  } catch (err) {
    console.log(err);
  }
};

//$ post new message

exports.message_post = [
  // Convert the genre to an array.
  // Validate and sanitize fields.
  body('message', 'message must not be empty.').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    console.log(req.body);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    let userObj = await User.findOne(req.user).exec();

    // Create a Book object with escaped and trimmed data.
    const newMessage = new Message({
      message: req.body.message,
      user: userObj,
    });

    console.log(newMessage);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all creators and categories for form.
      async.parallel(function (err, results) {
        if (err) {
          return next(err);
        }

        res.render('/', {
          title: 'Home',
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid. Save book.
      await newMessage.save();
      // refresh
      res.redirect('/');
    }
  },
];

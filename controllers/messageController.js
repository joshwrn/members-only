const async = require('async');

//+ Marketplace page
exports.index = function (req, res) {
  res.render('index', { title: 'Home' });
};

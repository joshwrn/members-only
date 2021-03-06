const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);

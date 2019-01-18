let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let message = new Schema({
  author: String,   
  message: String,
  time: String
});

const Message = mongoose.model('message', message);

module.exports = Message;

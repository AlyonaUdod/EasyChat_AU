let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  author: String,   
  content: String,
  time: Number,
  messageId: String,
  edited: Boolean,
  addAt: {type: Date, default: Date.now}
});

module.exports = messageSchema;
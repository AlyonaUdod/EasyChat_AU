let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  author: String,   
  content: String,
  time: Number,
  messageId: String,
  addAt: {type: Date, default: Date.now}
}, {
  versionKey: false,
  collection: "MessageCollection"
});

const Message = mongoose.model('MessageCollection', messageSchema);

module.exports = Message;
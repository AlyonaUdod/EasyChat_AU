let mongoose = require('mongoose');
let MessageSchema = require('./channelMessageModel')
let Schema = mongoose.Schema;

let channelSchema = new Schema({
  channelName: {type: String, unique: true, required: true},
  author: String, 
  addAt: {type: Date, default: Date.now},
  type: String,
  messages: [MessageSchema],
}, {
  versionKey: false,
  collection: "ChannelCollection"
});

const Channel = mongoose.model('ChannelCollection', channelSchema);

module.exports = Channel;
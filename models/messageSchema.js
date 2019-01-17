const mongoose = require('mongoose')

const Schema = mongoose.Schema

let messageSchema = new Schema({
    author: String,
    time: String,
    content: String,
});


const Message = mongoose.model('Message', messageSchema); // сначала создаем схему, потом подключаем монгуз модель
module.exports = Message
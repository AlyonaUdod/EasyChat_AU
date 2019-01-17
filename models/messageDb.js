const Message = require('./messageSchema');

module.exports.getMessagesFromDb = function(){
    return Message.find()
}

module.exports.postMessageToDb = function (data){
    const newMessage = Message({
        author: data.author,
        time: data.time,
        content: data.content,
    })
    return newMessage.save()
}
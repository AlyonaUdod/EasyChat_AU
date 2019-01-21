const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    path: '/chat/',
    origins: "*:*"
});
const PORT = process.env.PORT||3003;
app.use(cors());
app.options('*', cors());

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://admin:qwertyui90@ds157064.mlab.com:57064/sandbox_test');
const Message = require('./schema');

let online = 0;
let usersOnline = [];
io.on('connection', (client) => {    
    client.on('new-user', (user) => {
        console.log("User connected");
        console.log(++online); 
        client.broadcast.emit("change-online", online)
        console.log(user);
        let allMes = Message.find();
     
        allMes.exec(function(err,docs){   // sort('-time').limit(30)
            if (err) throw err;
            console.log('Send message from DB');
               let obj ={
                    docs: docs,
                    online: online,
                    usersOnline: usersOnline,
                    clientId: client.id,
                }
            client.emit('all-messages', obj)
        })  
    })
    client.on('send-user-name-to-online-DB', (user) => {
        usersOnline.push(user)
        console.log(usersOnline)
        io.emit('get-user-name', usersOnline)
    })
    client.on("disconnect", () => {
        // console.log("its work")
        // console.log(client.id)
        let a = usersOnline.filter(el => el.userId !== client.id)
        usersOnline = a
        // console.log(usersOnline)
        console.log(online > 0 ? --online : null);
        console.log(`Now in chat ${online} users.`); 
        client.broadcast.emit("change-online", online);
        io.emit('get-user-name', usersOnline)
    });

    client.on("message", (message) => {
        // console.log(message);
        Message.create(message, err => {
            if(err) return console.error(err);
            client.broadcast.emit("new-message", message);
        }); 
    });
    client.on("typing", (data) => {
        console.log(data)
        client.broadcast.emit("somebody-typing", data);
    })
    client.on('deleteMessage', (id) => {
        Message.findOneAndRemove({messageId: id}, err => {
            if (err) throw err
            console.log('Message succsessfully delete!')
            client.broadcast.emit("message-was-deleted", id);
        })
    })
    client.on("editMessage", (id, editMess) => {
        Message.findOneAndUpdate({messageId: id}, editMess, err => {
            if (err) throw err
            console.log('Message succsessfully edit!')
            client.broadcast.emit("message-was-edited", editMess);
        })
    })
});
app.use(express.static('./frontend/build'));
server.listen(PORT, () => (console.log(`server is running on ${PORT}`)));
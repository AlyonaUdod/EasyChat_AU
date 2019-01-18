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
// app.get('/', (req, res) => {
//     Message.find({}, (err,message) => {
//         if (err) throw err;
//         res.json(message)        
//     })
// })
let online = 0;
io.on('connection', (client) => {    
        console.log("User connected");
    //     let allMessages = Message.find();    
    // client.broadcast.emit("all-masseges", allMessages);
        console.log(++online);   
    client.broadcast.emit("change-online", online);
    client.on("disconnect", () => {
        console.log(--online);
        client.broadcast.emit("change-online", online);
        });
    client.on("message", (message) => {
        console.log(message);
        Message.create(message, err => {
            if(err) return console.error(err);
            client.broadcast.emit("new-message", message);
        });     
    });
    client.on("typing", (is) => {
        client.broadcast.emit("somebody-typing", is);
    })
});
app.use(express.static('./frontend/build'));
server.listen(PORT, () => (console.log(`server is running on ${PORT}`)));
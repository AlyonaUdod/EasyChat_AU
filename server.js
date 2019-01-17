const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    path: '/chat/',
    origins: "*:*"
});
const cors = require('cors');
const PORT = process.env.PORT || 3003
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Message = require('./models/messageSchema');

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://admin:qwertyui90@ds157064.mlab.com:57064/sandbox_test');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.options('*', cors())


let online = 0;
let all = []

// app.get('/', (req, res) => {
//     Message.find({}, (err,users) => {
//         if (err) throw err;
//         res.json(users)
//     })
// })

io.on('connect', (client) => {
    console.log("User connected");
    console.log(online++);
    console.log(`Now users : ${online}`)

    console.log(all)
    client.broadcast.emit("change-online", online);
    client.on("message", (message) => {
        console.log(message);
        client.broadcast.emit("new-message", message);

        const newMessage = Message(message)
        newMessage.save((err) => {
        if (err) throw err
        })
    });
    client.on("typing", (is) => {
        client.broadcast.emit("somebody-typing", is);
    });
    client.on("disconnect", () => {
        console.log("User disconnected");
        console.log(--online);
        console.log(`Now users : ${online}`)
        client.broadcast.emit("change-online", online);
    });
})

app.use((req, res, next) => {
    res
      .status(404)
      .json({err: '404'});
  });
  
app.use((err, req, res, next) => {
    console.log(err.stack);
    res
      .status(500)
      .json({err: '500'});
  })

  
app.use(express.static('./frontend/build'));
server.listen(PORT, () => (console.log(`Server start on port ${PORT}`)))
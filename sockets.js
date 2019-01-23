const Message = require('./messageModel');
const User = require('./userModel');
const _ = require('lodash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('./config')

// function auth (socket, next) {
//     // Parse cookie
//     cookieParser()(socket.request, socket.request.res, () => {});

//     // JWT authenticate
//     passport.authenticate('jwt', {session: false}, function (error, decryptToken, jwtError) {
//         if(!error && !jwtError && decryptToken) {
//             next(false, {username: decryptToken.username, id: decryptToken.id});
//         } else {
//             next('guest');
//         }
//     })(socket.request, socket.request.res);
// }

function createToken (body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

function checkAuth (client, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if(jwtError != void(0) || err != void(0)) return 'Some error!!!!';
        client.user.decryptToken = decryptToken;
        next();
    })(client, next);
}


let online = 0;
let usersOnline = [];
let message = {};

module.exports = io => {
    io.on('connection', (client) => {   
        // client.join('general')

        client.on('new-user', (user) => {
            console.log("User connected");
            console.log(++online); 
            client.broadcast.emit("change-online", online)
            console.log(user);
            let allMes = Message.find() // .sort({addAt: 1}).limit(30).lean();
            allMes.exec(function(err,docs){   // sort('-time').limit(30)
                if (err) throw err;
                console.log('Send message from DB');
                   let obj ={
                        docs: docs,
                        online: online,
                        usersOnline: usersOnline,
                        clientId: client.id,
                    }
                // client.to('general').emit('all-messages', obj, general)
                client.emit('all-messages', obj)
            })  

            let allUsers = User.find()
            allUsers.exec(function(err,docs2) {
                if (err) throw err;
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!');
                client.emit('all-users', docs2)
            })
        })
        client.on('send-user-name-to-online-DB', (user) => {
            usersOnline.push(user)
            console.log(usersOnline)
            io.emit('get-user-name', usersOnline)
        })
        client.on("disconnect", () => {
            let arr = usersOnline.filter(el => el.userId !== client.id)
            usersOnline = arr
    
            console.log(online > 0 ? --online : null);
            console.log(`Now in chat ${online} users.`); 
            client.broadcast.emit("change-online", online);
            io.emit('get-user-name', usersOnline)
        });
    
        client.on("message", (message) => {
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
        client.on('registration', async(user) => {
            try {
                let userDB = await User.findOne({email: user.email}).lean().exec();
                if(userDB != void(0)) {
                    message = {message: "User already exist"} 
                    client.emit('registration-on-DB', message);
                } else {
                   userDB = await User.create({
                        username: user.username,
                        password: user.password,
                        email: user.email,
                    });  
                    const token = createToken({id: userDB._id, username: userDB.username});
                    // client.cookie('token', token, {
                    //     httpOnly: true
                    // });
                    message = {message: "User created", currentUser: userDB};
                    client.emit('registration-on-DB', message);
                }
            } catch (e) {
                console.error("E, registeration,", e);
                message = {message: "DB error, try later please"};
                client.emit('register-on-DB', message);
            }
        })
        client.on('login', async (user) => {
            try {
                let userDb = await User.findOne({email: user.email}).lean().exec();
                if(userDb != void(0) && bcrypt.compareSync(user.password, userDb.password)) {
                    const token = createToken({id: user._id, username: user.username});
                    // res.cookie('token', token, {
                    //     httpOnly: true
                    // });
                    message = {message: "User login success", currentUser: userDb};
                    client.emit('login-on-DB', message);
                } else if (userDb == void(0)) {
                    message = {message: "User not exist"};
                    client.emit('login-on-DB', message);
                } else if (userDb != void(0) && !bcrypt.compareSync(user.password, userDb.password)) {
                    message = {message: "Password false, try again"};
                    client.emit('login-on-DB', message);
                }
            } catch (e) {
                console.error("E, login,", e);
                message = {message: "Some DB error."};
                client.emit('login-on-DB', message);
            }
        })
    });
};
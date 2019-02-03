const User = require('./models/userModel');
const Channel = require('./models/channelModel')
const _ = require('lodash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const config = require('./config');
// const socketioJwt = require('socketio-jwt');
const socketioJwt = require('socketio-jwt');

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

function checkAuth (client) {
    // console.log('bbb')

    let decoder = jwt.decode(client)
    console.log(decoder)

    // passport.authenticate('jwt', { session: false }, function(err, decryptToken, jwtError) {
    //     // console.log(decryptToken)
    //     if(!err && !jwtError && decryptToken) {
    //         console.log('ccc')
    //         console.log(decryptToken)
    //         return 'Some error!!!!';
    //     } else {
    //         console.log('eeee')
    //         let _id = decryptToken.id;
    //         let a = {username: decryptToken.username, id: decryptToken.id}
    //         console.log('its decr token', a)  
    //         return _id
    //     }
      
    // })(client);
}


let online = 0; 
let usersOnline = [];
let message = {};
let channels = [];
let users = [];

module.exports = io => {
    // io.use(
    //     socketioJwt.authorize({
    //         secret: config.jwt.secretOrKey,
    //         // handshake: true,
    //     })
    // );
    io.on('connection', (client) => {   

        // console.log('aaaaa', client.handshake.query.decoded_tocken.username);
       
        // let token = client.handshake.query.decoded_tocken;
        // console.log('aaaaa', token)
        // checkAuth(token)

     
        client.on('new-user', () => {
            let allUsers = User.find()
                allUsers.lean().exec(function(err,docs2) {
                    if (err) throw err;
                    return users = docs2
                })
                
            let allChannels = Channel.find()
                allChannels.lean().exec(function(err,data) {
                    if (err) throw err;
                    return channels = data
                })
            client.emit('client-id', client.id)
        })
        client.on('send-user-name-to-online-DB', (user) => {
            usersOnline.push(user)
            console.log(usersOnline)
            io.emit('send-users-online', usersOnline)
        })
        client.on("disconnect", () => {
            let arr = usersOnline.filter(el => el.clientId !== client.id)
            usersOnline = arr
            console.log(online > 0 ? --online : null);
            console.log(`Now in chat ${online} users.`); 
            client.broadcast.emit("change-online", online);
            console.log(usersOnline)
            io.emit('send-users-online', usersOnline)
        });
        client.on('user-sign-out', (id) => {
            let arr = usersOnline.filter(el => el.clientId !== id)
            usersOnline = arr
            console.log(online > 0 ? --online : null);
            console.log(`Now in chat ${online} users.`); 
            client.broadcast.emit("change-online", online);
            console.log(usersOnline)
            io.emit('send-users-online', usersOnline)
        })
        // client.on("typing", (data) => {
        //     console.log(data)
        //     client.broadcast.emit("somebody-typing", data);
        // })
        client.on('editChannelMessage',(obj) => {
             Channel.findOne({
                _id: obj.currentChannel
            }).exec()
            .then((channel) => {
                let arr = channel.messages.map(el => el.messageId === obj.message.messageId ? obj.message : el)
                channel.messages = arr
                return channel.save()
            })
            .then(() => {
                let allChannels = Channel.find()
                allChannels.lean().exec(function(err,docs3) {
                    if (err) throw err;
                    io.emit('all-channels', docs3)
                })
            })
            .catch(err => {
                console.log(err)
            })
        })
        client.on('deleteChannelMessage',(obj) => {
            Channel.findOne({
               _id: obj.currentChannel
           }).exec()
           .then((channel) => {
               let arr = channel.messages.filter(el => el.messageId !== obj.messageId)
               channel.messages = arr
               return channel.save()
           })
           .then(() => {
               let allChannels = Channel.find()
               allChannels.lean().exec(function(err,docs3) {
                   if (err) throw err;
                   io.emit('all-channels', docs3)
               })
           })
           .catch(err => {
               console.log(err)
           })
       })
        client.on('registration', async(user) => {
            try {
                let userDb = await User.findOne({email: user.email}).lean().exec();
                if(userDb != void(0)) {
                    message = {message: "User already exist"} 
                    client.emit('registration-on-DB', message);
                } else {
                   userDb = await User.create({
                        username: user.username,
                        password: user.password,
                        email: user.email,
                        links: user.link,
                    });  
                    const token = createToken({id: userDb._id, username: userDb.username});
                    // client.cookie('token', token, {
                    //     httpOnly: true
                    // });

                    console.log("User connected");
                    console.log(++online); 
                    client.broadcast.emit("change-online", online)

                    message = {
                        message: "User created", 
                        currentUser: userDb, 
                        allUsers: users, 
                        allChannels: channels,
                        online: online,
                        clientId: client.id,
                    };
                    client.emit('registration-on-DB', message);

                    let allUsers = User.find()
                    allUsers.lean().exec(function(err,docs2) {
                        if (err) throw err;
                        io.emit('all-users', docs2)
                    })
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
                    client.emit('cookie', token)

                    console.log("User connected");
                    console.log(++online); 
                    client.broadcast.emit("change-online", online)

                    message = {
                        message: "User login success", 
                        currentUser: userDb, 
                        allUsers: users, 
                        allChannels: channels,
                        online: online,
                        clientId: client.id,
                        token: token,
                    };
                    client.emit('login-on-DB', message);
                    
                } else if (userDb == void(0) || userDb != void(0) && !bcrypt.compareSync(user.password, userDb.password)) {
                    message = {message: "User not exist or password false"};
                    client.emit('login-on-DB', message);
                // } else if (userDb != void(0) && !bcrypt.compareSync(user.password, userDb.password)) {
                //     message = {message: "Password false, try again"};
                //     client.emit('login-on-DB', message);
                }
            } catch (e) {
                console.error("E, login,", e);
                message = {message: "Some DB error."};
                client.emit('login-on-DB', message);
            }
        })
        client.on('change-user-avatar', (obj) => {
            User.findOneAndUpdate({_id: obj.id}, {avatar: obj.img}, err => {
                if (err) {
                    throw err
                } else {
                    let allUsers = User.find()
                    allUsers.lean().exec(function(err,docs2) {
                        if (err) throw err;
                        io.emit('all-users', docs2)
                    })
                    User.findOne({_id: obj.id}).lean().exec(function(err,user) {
                        if (err) throw err;
                        client.emit("user-avatar-was-edited", user)
                    })
                }  
            })
        })
        client.on('create-channel', (obj) => {
            Channel.create(obj, (err,data) => {
                if(err) return console.error(err);
                console.log('Channel create!')
                client.emit("channel-created", data);

                let allChannels = Channel.find()
                allChannels.lean().exec(function(err,docs3) {
                    if (err) throw err;
                    io.emit('all-channels', docs3)
                })
            })
        })
        client.on("channel-message", (obj) => {
            Channel.findOne({
                _id: obj.currentChannel
            }).exec()
            .then((channel) => {
                console.log(channel)
                channel.messages.push(obj.message)
                return channel.save()
            })
            .then(() => {
                let allChannels = Channel.find()
                allChannels.lean().exec(function(err,docs3) {
                    if (err) throw err;
                    io.emit('all-channels', docs3)
                })
            })
            .catch(err => {
                console.log(err)
            })
        });
        client.on("user-change-link", (sendToDB) =>{
            User.findOneAndUpdate({
                email: sendToDB.userEmail
            }, {links:sendToDB.link})
        .catch(error => {
            console.log(error);
        })
        client.emit('Link_added')
        })
    });
};
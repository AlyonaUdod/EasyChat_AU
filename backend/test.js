const Users = require('../models/users.model');
const Message = require('./model/messagesModel');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('./config');

let message = {};

// function auth (client, next) {

//     // Parse cookie
//     cookieParser()(client.request, client.request.res, () => {});

//     // JWT authenticate
//     passport.authenticate('jwt', {session: false}, function (error, decryptToken, jwtError) {
//         if(!error && !jwtError && decryptToken) {
//             next(false, {username: decryptToken.username, id: decryptToken.id});
//         } else {
//             next('guest');
//         }
//     })(client.request, client.request.res);
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
        if(jwtError != void(0) || err != void(0)) return ?????;
        client.user = decryptToken;
        next();
    })(client, next);
}


io.on('connection', (client) => {
    //client.join('general'); 
    client.on('new-user', (user) => {
        console.log("User connected");
        console.log(++online);
        client.broadcast.emit("change-online", online);
        console.log(user);
        let allMes = Message.find().sort({addAt:1}).limit(5).lean();
        allMes        
        .exec(function(err,docs){
                if(err) throw err;
                console.log('Send massege from DB');
                client.emit('all-messages', docs);  //client.to('general').emit('all-messages', docs);
                // console.log(docs);
        });
    }); 
    client.on('register', (user) => {
        try {
            let userDB = await Users.findOne({username: {$regex: _.escapeRegExp(user.username), $options: "i"}}).lean().exec();
            if(userDB != void(0)) message = {message: "User already exist"};

            userDB = await UsersModel.create({
                username: user.username,
                password: user.password
            });

            const token = createToken({id: userDB._id, username: userDB.username});

            client.cookie('token', token, {
                httpOnly: true
            });

            message = {message: "User created."};
            client.emit('register-on-DB', message);
        } catch (e) {
            console.error("E, register,", e);
            message = {message: "some error"};
            client.emit('register-on-DB', message);
        }
    })
    client.on('login', (user) => {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                res.cookie('token', token, {
                    httpOnly: true
                });

                res.status(200).send({message: "User login success."});
            } else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    })
      
    client.on("disconnect", () => {
        let a = usersOnline.filter(el => el.userId !== client.id);
        usersOnline = a;
        console.log(online > 1 ? --online : null);
        console.log(`Now in chat ${online} users.`);
        client.broadcast.emit("change-online", online);
        client.emit('get-user-name', usersOnline, client.clearCookie('token'))
        });

    client.on("message", (message) => {      
        Message.create(message, err => {
            if(err) return console.error(err);
            client.broadcast.emit("new-message", message);
        })
    });
    client.on("deleteMessage", (messageId) => {
        Message.findOneAndDelete({frontId:messageId}, err => {
            if(err) throw err;
            console.log('Message del');
            client.broadcast.emit("messageWasDeleted", messageId);
        })
    });
    client.on("typing", (is) => {
        client.broadcast.emit("somebody-typing", is);
    })
    client.on("editMessage", (id, editMess) => {
        Message.findOneAndUpdate({frontId: id}, editMess, err => {
            if (err) throw err;
            console.log('Message succsessfully edit!')
            client.broadcast.emit("message-was-edited", editMess);
        })
    })
});
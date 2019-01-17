const db = require('../models/userDb.js');

module.exports.getMessages = (req, res) => {
    db
    .getMessagesFromDb()
    .then(data => {
        res.json(data)
    })
    .catch(err =>{
        res
        .status(400)
        .json({err: err.message});
    })
}

module.exports.postMessage = (req, res) => {
    db
    .postMessageToDb(req.body)
    .then((data) => {
      res
        .status(201)
        .json(data);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
}
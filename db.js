const mongoose = require('mongoose');
const Cats = require('./schema');

const isNotValid = data => {
  let isName = !!data.name;
  let isAge = !!data.age;
  return !isName || !isAge;
};

module.exports.gets = function () {
  return Cats.find()
};

module.exports.getById = function (paramsId) {
  return Cats.findById({"_id": paramsId})
};

module.exports.add = function (data) {
 
  let Cat = new Cats({
    name: data.name,
    age: parseInt(data.age)
  });

  return Cat.save()
};

module.exports.update = function (data, paramsId) {
  let updateCat = {
    name: data.name,
    age: parseInt(data.age)
  };

  return Cats.findByIdAndUpdate({
    "_id": paramsId
  }, {
    $set: updateCat
  }, {new: true}) 
  // new: bool - true to return the modified document rather than the original. defaults to false
};

module.exports.delete = function (paramsId) {
  return Cats.findByIdAndRemove({"_id": paramsId})
};

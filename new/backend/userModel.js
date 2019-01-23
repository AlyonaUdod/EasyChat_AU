const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    message: {},
    addAt: { type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "UserCollection"
  }
)

userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next()
})

const User = mongoose.model('user', userSchema);

module.exports = User
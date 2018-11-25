const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{VALUE is not a valid email.}'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    let userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function() {
    let access = 'auth';
    let token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();

    this.tokens.push({access, token});

    return this.save().then(() => {
        return token;
    })
};

let User = mongoose.model('User', userSchema);

module.exports = {
    User
}
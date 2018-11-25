const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

userSchema.statics.findByToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject(e);
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
};

userSchema.pre('save', function(next) {
    if(this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(this.password, salt, (err, res) => {
                this.password = res;
                next();
            });
        });

    } else {
        next();
    }
});

let User = mongoose.model('User', userSchema);

module.exports = {
    User
}
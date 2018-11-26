const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'lovepr@example.com',
    password: '123abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},{
    _id: userTwoId,
    email: 'example@exam.com',
    password: '123abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    _creator: userTwoId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done()).catch((e) => done());
};

module.exports = { 
    todos, 
    populateTodos,
    users,
    populateUsers
}
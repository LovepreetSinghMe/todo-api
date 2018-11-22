const mongoose = require('mongoose');

atlasURI = 'mongodb+srv://lovepreet1730:<PASSWORD>@cluster0-3e435.mongodb.net/TodoApp?retryWrites=true';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = {
    mongoose
};
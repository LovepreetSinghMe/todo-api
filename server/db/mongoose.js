const mongoose = require('mongoose');

atlasURI = 'mongodb+srv://lovepreet1730:<PASSWORD>@cluster0-3e435.mongodb.net/TodoApp?retryWrites=true';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

module.exports = {
    mongoose
};
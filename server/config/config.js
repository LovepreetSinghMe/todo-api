let env = process.env.NODE_ENV || 'development';

if(env === 'development') { 
    MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
    MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to mongodb server.');
    }

    const db = client.db('TodoApp');

    // console.log('connected to mongodb server.');

    // db.collection('Todos').insertOne({
    //     text: 'Things to do',
    //     completed: false
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert todo.', error);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2)); 
    // });

    // db.collection('Users').insertOne({
    //     name: 'Lovepreet Singh',
    //     age: 22,
    //     location: 'Rajasthan, India'
    // }, (error, result) => {
    //     if(error) throw error;

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    


    client.close();
});
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to mongodb server.');
    }

    const db = client.db('TodoApp');
    
    // returns a cursor. sort of pointer to the values. To array return a promise.
    db.collection('Todos').find({
        _id: new ObjectID('5bf2ded132caaecbc0afe05b')
    }).toArray().then((docs) => {

        console.log(JSON.stringify(docs, undefined, 2));

    }, (error) => {
        console.log('Unable to fetch.', error);
    });

    // client.close();
});
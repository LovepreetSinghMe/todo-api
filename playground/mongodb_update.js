const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to mongodb server.');
    }

    const db = client.db('TodoApp');

    //findOneAndUpdate: finds the document matching the query and return updated document. Document is updated using an opdate operator.

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bf2adcb9efc0c1810ee4db9')
    }, {
        $set : {
            name: 'Lovepreet Singh Dhillon'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // client.close();
});
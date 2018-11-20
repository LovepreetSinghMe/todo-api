const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to mongodb server.');
    }

    const db = client.db('TodoApp');
    
    //deleteMany: Deletes all the items that match a criteria and returns a promise as well.
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    //deleteOne: Deletes the first item matching the query.

    //findOneAndDelete: Return the document then deletes it.

    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID('5bf2ded132caaecbc0afe05b')
    }).then((result) => {
        console.log(result);
    });


    // client.close();
});
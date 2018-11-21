const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = "5bf4df4eac2aa131d8e804ba";

// if(ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

//Mongoose Model.find() can find a result just with a string as _id. Passing it as an ObjectID is not necessary. For searches with just the id, it is better to use findOne because it return an object matching the query instead of an array. 
Todo.find({
    _id: id
}).then((todos) => {
    console.log(todos);
});

//One document by id. If id does not match, it retruns null or empty array in case of findMany. In case of invalid id, throws an error to the catch block.
Todo.findById(id).then((todo) => {
    console.log(todo);
});
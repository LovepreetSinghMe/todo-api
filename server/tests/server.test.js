require('./../config/config');

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/mongoose');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });

    });

    it('should not add an invalid todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);

    });

});

describe('GET /todos:id', () => {

    it('should get todo with the specified valid id', (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should respond with 404 when no record found', (done) => {

        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should respond with 404 when id is invalid', (done) => {

        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('should delete todo with the specified valid id', (done) => {
        let id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should respond with 404 when no record found', (done) => {

        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should respond with 404 when id is invalid', (done) => {

        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update a todo with recieved values when id is valid', (done) => {
        let id = todos[1]._id.toHexString();
        let body = {
            completed: true
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).not.toBe(null);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(res.body.todo.completedAt).toBe(todo.completedAt);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('GET /users/me', () => {
    it('should return a user if authenticated', (done) => {

        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should respond with 401 if user not authenticated', (done) => {

        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {

    it('should create a new user', (done) => {
        let email = 'lovely@gmail.com';
        let password = '123321'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return with a 400 when information sent is invalid' ,(done) => {

        let email = 'fwijfeoiwe';
        let password = 'flw';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });

    it('should return with 400 when email already in use', (done) => {
        let email = users[0].email;
        let password = 'flwdwdw';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });
});

describe('POST /users/login', () => {

    it('should generate a token when email and password match in database', (done) => {

        request(app)
            .post('/users/login')
            .send(users[1])
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[1]._id.toHexString());
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end(done);
    });

    it('should reject invalid login', (done) => {

        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: 'esnsnss'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end(done);
    });
});
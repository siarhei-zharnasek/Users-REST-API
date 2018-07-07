const request = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});
const assert = require('assert');
const User = require('../models/user');
const app = require('../index');
let server;

describe('RESP API app: ', async () => {
    before(done => server = app.listen(3001, done));
    after(done => server.close(done));

    describe('GET /users: ', async () => {
        let body;
        let _id;

        beforeEach(async () => {
            const email = `${Math.random()}qwe@${Math.random()}kek.ru`;
            body = {
                email,
                displayName: 'admin'
            };
            const addedUser = await request({
                method: 'POST',
                uri: 'http://localhost:3000/users',
                json: true,
                body
            });
            _id = addedUser.body._id;
        });

        afterEach(async () => {
            await request({
                method: 'DELETE',
                uri: `http://localhost:3000/users/${_id}`
            });
        });

        it('should respond with existing user', async () => {
            const response = await request({
                uri: 'http://localhost:3000/users',
                json: true
            });
            const {email, displayName} = response.body.find(user => user.email === body.email);
            assert.equal(email, body.email);
            assert.equal(displayName, body.displayName);
        });
    });
});

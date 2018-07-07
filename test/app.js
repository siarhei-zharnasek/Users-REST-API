const request = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});
const assert = require('assert');
const app = require('../index');
let server;

const requestWrapper = (method, body, param = '') => request({
    method,
    uri: `http://localhost:3000/users/${param}`,
    json: true,
    body
});

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
            const addedUser = await requestWrapper('POST', body);
            _id = addedUser.body._id;
        });

        afterEach(async () => {
            await requestWrapper('DELETE', {}, _id);
        });

        it('should respond with existing user', async () => {
            const response = await requestWrapper();
            const {email, displayName} = response.body.find(user => user.email === body.email);
            assert.equal(email, body.email);
            assert.equal(displayName, body.displayName);
        });
    });

    describe('GET /users/:id: ', async () => {
        let body;
        let _id;

        beforeEach(async () => {
            const email = `${Math.random()}qwe@${Math.random()}kek.ru`;
            body = {
                email,
                displayName: 'admin'
            };
            const addedUser = await requestWrapper('POST', body);
            _id = addedUser.body._id;
        });

        afterEach(async () => await requestWrapper('DELETE', body));

        it('should respond with existing user', async () => {
            const response = await requestWrapper('GET', {}, _id);
            const {email, displayName} = response.body;
            assert.equal(email, body.email);
            assert.equal(displayName, body.displayName);
        });

        it('should respond with 404 if user doesnt exist', async () => {
            const response = await requestWrapper('GET', {}, 'there-is-no-user');
            assert.equal(response.body, 'Not Found');
            assert.equal(response.statusCode, 404);
        });
    });

    describe('POST /users ', async () => {
        const email = `${Math.random()}qwe@${Math.random()}kek.ru`;
        const body = {
            email,
            displayName: 'admin'
        };

        afterEach(async () => await requestWrapper('DELETE', body));

        it('should respond with existing user', async () => {
            const addedUser = await requestWrapper('POST', body);

            assert.equal(addedUser.body.email, body.email);
            assert.equal(addedUser.body.displayName, body.displayName);
        });

        it('should respond with 400 if there is _id in body', async () => {
            const response = await requestWrapper('POST', Object.assign({_id: 1}, body));
            assert.equal(response.body, 'No id allowed');
            assert.equal(response.statusCode, 400);
        });

        it('should respond with 400 if user with such email exists', async () => {
            await requestWrapper('POST', body);
            const response = await requestWrapper('POST', body);
            assert.equal(response.statusCode, 400);
        });
    });
});

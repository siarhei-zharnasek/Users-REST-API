if (process.env.TRACE) {
    require('./libs/trace');
}

const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const mongoose = require('mongoose');
const {getUsers, getUserById, postUsers, patchUsers, deleteUserById} = require('./routes/users');
const bodyIdNotAllowed = require('./middlewares/bodyIdNotAllowed');

const app = new Koa();
const router = new Router();

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));
mongoose.Promise = Promise;
mongoose.connect('mongodb://admin:admin1@ds129541.mlab.com:29541/koa-users', { useNewUrlParser: true });

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', bodyIdNotAllowed, postUsers);
router.patch('/users/:id', bodyIdNotAllowed, patchUsers);
router.delete('/users/:id', deleteUserById);

app.use(router.routes());

app.listen(3000);

module.exports = app;

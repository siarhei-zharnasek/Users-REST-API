const User = require('../models/user');

module.exports.getUsers = async ctx => {
    ctx.body = await User.find({});
};

module.exports.getUserById = async ctx => {
    const {id} = ctx.params;

    try {
        const user = await User.findOne({_id: id});

        if (user) {
            ctx.body = user;
        } else {
            ctx.status = 404;
        }
    } catch (e) {
        ctx.status = 404;
    }
};

module.exports.postUsers = async ctx => {
    const {email, displayName} = ctx.request.body;

    try {
        const user = new User({email, displayName});
        await user.save();

        ctx.body = user;
    } catch (err) {
        ctx.status = 400;
        ctx.body = err;
    }
};

module.exports.patchUsers = async ctx => {
    const {id} = ctx.params;
    const {email, displayName} = ctx.request.body;

    try {
        await User.findOne({_id: id});
    } catch (err) {
        return ctx.status = 404;
    }

    try {
        await User.update({_id: id}, {email, displayName}, {multi: true});
        ctx.body = 'OK';
    } catch (err) {
        ctx.status = 400;
        ctx.body = err;
    }
};

module.exports.deleteUserById = async ctx => {
    const {id} = ctx.params;
    const deletedUser = await User.findOneAndRemove({_id: id});

    if (deletedUser) {
        ctx.body = deletedUser;
    } else {
        ctx.status = 404;
    }
};

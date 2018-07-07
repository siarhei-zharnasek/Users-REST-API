module.exports = async (ctx, next) => {
    const {_id} = ctx.request.body;

    if (_id) {
        return ctx.throw(400, 'No id allowed');
    }

    await next();
};

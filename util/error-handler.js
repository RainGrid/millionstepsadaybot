const asyncWrapper = (fn) => {
    return async function (ctx, next) {
        try {
            return await fn(ctx);
        } catch (error) {
            console.log(error);
            await ctx.reply(ctx.i18n.t('shared.something_went_wrong'));
            return next();
        }
    };
};

module.exports = asyncWrapper;
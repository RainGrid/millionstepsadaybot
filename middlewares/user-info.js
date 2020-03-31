const User = require('../models/User');

exports.getUserInfo = async (ctx, next) => {
    if (!ctx.session.language) {
        const user = await User.findOne({telegram_id: ctx.from.id});

        if (user) {
            ctx.session.language = user.language;
            ctx.i18n.locale(user.language);
        }
    }

    return next();
};
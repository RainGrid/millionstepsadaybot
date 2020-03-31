const User = require('../models/User');

exports.updateUserTimestamp = updateUserTimestamp = async (ctx, next) => {
    await User.findOneAndUpdate(
        { telegram_id: ctx.from.id },
        { lastActivity: new Date().getTime() },
        { new: true }
    );
    return next();
};
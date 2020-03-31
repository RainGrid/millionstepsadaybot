const User = require('../models/User');
const { saveToSession } = require('./session');

exports.updateLanguage = async function (ctx, newLang) {
    await User.findOneAndUpdate(
        { telegram_id: ctx.from.id },
        {
            language: newLang
        },
        { new: true }
    );

    saveToSession(ctx, 'language', newLang);

    ctx.i18n.locale(newLang);
}
const { Extra } = require('telegraf');

exports.getLanguageKeyboard = function () {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                m.callbackButton(`Русский`, JSON.stringify({ a: 'languageChange', p: 'ru' }), false)
            ],
            {}
        )
    );
}

exports.getAccountConfirmKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                m.callbackButton(
                    ctx.i18n.t('scenes.start.lets_go'),
                    JSON.stringify({ a: 'confirmAccount' }),
                    false
                )
            ],
            {}
        )
    );
}

const { Extra } = require('telegraf');

exports.getRatingsKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.ratings.daily'),
                        JSON.stringify({ a: 'getDailyRatings' }),
                        false
                    ),
                    m.callbackButton(
                        ctx.i18n.t('scenes.ratings.total'),
                        JSON.stringify({ a: 'getTotalRatings' }),
                        false
                    )
                ]
            ],
            {}
        )
    );
}

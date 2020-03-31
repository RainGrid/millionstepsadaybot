const { Extra } = require('telegraf');

exports.getStatisticsKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.daily'),
                        JSON.stringify({ a: 'getDailyStatistics' }),
                        false
                    ),
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.yesterday'),
                        JSON.stringify({ a: 'getYesterdayStatistics' }),
                        false
                    )

                ],
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.weekly'),
                        JSON.stringify({ a: 'getWeeklyStatistics' }),
                        false
                    ),
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.monthly'),
                        JSON.stringify({ a: 'getMonthlyStatistics' }),
                        false
                    )
                ],
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.yearly'),
                        JSON.stringify({ a: 'getYearlyStatistics' }),
                        false
                    ),
                    m.callbackButton(
                        ctx.i18n.t('scenes.statistics.today'),
                        JSON.stringify({ a: 'startDailyScene' }),
                        false
                    )
                ]
            ],
            {}
        )
    );
}

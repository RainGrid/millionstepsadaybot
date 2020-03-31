const { Extra } = require('telegraf');

exports.getLocationKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.resize()
            .keyboard(
                [
                    [
                        m.locationRequestButton(ctx.i18n.t('scenes.location.send_location')),
                        ctx.i18n.t('scenes.location.decline')
                    ]
                ]
            )
            .oneTime()
    );
}

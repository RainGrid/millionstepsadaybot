const { Extra } = require('telegraf');
const { get } = require('lodash');
const { saveToSession } = require('../../util/session');

exports.getMainKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.settings.language_button'),
                        JSON.stringify({ a: 'languageSettings' }),
                        false
                    ),
                    m.callbackButton(
                        ctx.i18n.t('scenes.settings.account_summary_button'),
                        JSON.stringify({ a: 'accountSummary' }),
                        false
                    )

                ],
                [
                    m.callbackButton(
                        ctx.i18n.t('scenes.settings.location_button'),
                        JSON.stringify({ a: 'locationSettings' }),
                        false
                    )
                ]
            ],
            {}
        )
    );
}

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

exports.getAccountSummaryKeyboard = function (ctx) {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                m.callbackButton(
                    ctx.i18n.t('scenes.settings.back_button'),
                    JSON.stringify({ a: 'closeAccountSummary' }),
                    false
                )
            ],
            {}
        )
    );
}

exports.sendMessageToBeDeletedLater = async function (
    ctx,
    translationKey,
    extra
) {
    ctx.webhookReply = false;
    const message = await ctx.reply(ctx.i18n.t(translationKey), extra);
    const messagesToDelete = get(ctx.session, 'settingsScene.messagesToDelete', []);

    saveToSession(ctx, 'settingsScene', {
        messagesToDelete: [
            ...messagesToDelete,
            {
                chatId: message.chat.id,
                messageId: message.message_id
            }
        ]
    });
}

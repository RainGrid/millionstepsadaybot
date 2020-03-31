const {
    getMainKeyboard,
    getLanguageKeyboard,
    getAccountSummaryKeyboard,
    sendMessageToBeDeletedLater
} = require('./helpers');
const User = require('../../models/User');
const { updateLanguage } = require('../../util/language');
const { getBackKeyboard } = require('../../util/keyboards');
const { deleteFromSession } = require('../../util/session');

exports.languageSettingsAction = async (ctx) =>
    await ctx.editMessageText(ctx.i18n.t('scenes.settings.pick_language'), getLanguageKeyboard());

exports.languageChangeAction = async (ctx) => {
    const langData = JSON.parse(ctx.callbackQuery.data);
    await updateLanguage(ctx, langData.p);
    const { backKeyboard } = getBackKeyboard(ctx);

    for (const msg of ctx.session.settingsScene.messagesToDelete) {
        await ctx.telegram.deleteMessage(msg.chatId, msg.messageId);
    }
    deleteFromSession(ctx, 'settingsScene');
    await sendMessageToBeDeletedLater(ctx, 'scenes.settings.language_changed', getMainKeyboard(ctx));
    await sendMessageToBeDeletedLater(ctx, 'scenes.settings.what_to_change', backKeyboard);
};

exports.accountSummaryAction = async (ctx) => {
    const user = await User.findOne({telegram_id: ctx.from.id});

    await ctx.editMessageText(
        ctx.i18n.t('scenes.settings.account_summary', {
            username: user.username,
            id: user.telegram_id
        }),
        getAccountSummaryKeyboard(ctx)
    );
    await ctx.answerCbQuery();
};

exports.closeAccountSummaryAction = async (ctx) => {
    await ctx.editMessageText(ctx.i18n.t('scenes.settings.what_to_change'), getMainKeyboard(ctx));
    await ctx.answerCbQuery();
};

const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard: getSettingsMainKeyboard, sendMessageToBeDeletedLater } = require('./helpers.js');
const {
    languageSettingsAction,
    languageChangeAction,
    accountSummaryAction,
    closeAccountSummaryAction
} = require('./actions');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');
const { deleteFromSession } = require('../../util/session');

const { leave } = Stage;
const settings = new Scene('settings');

let isRedirect = false;

settings.enter(async (ctx) => {
    const { backKeyboard } = getBackKeyboard(ctx);

    deleteFromSession(ctx, 'settingsScene');
    await sendMessageToBeDeletedLater(
        ctx,
        'scenes.settings.what_to_change',
        getSettingsMainKeyboard(ctx)
    );
    await sendMessageToBeDeletedLater(ctx, 'scenes.settings.settings', backKeyboard);
});

settings.leave(async (ctx) => {
    if (!isRedirect) {
        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
        deleteFromSession(ctx, 'settingsScene');
    };
});

settings.command('saveme', leave());
settings.hears(match('keyboards.back_keyboard.back'), leave());

settings.action(/languageSettings/, languageSettingsAction);
settings.action(/languageChange/, languageChangeAction);
settings.action(/locationSettings/, async (ctx) => {
    await ctx.answerCbQuery();
    isRedirect = true;
    ctx.scene.enter('location');
});
settings.action(/accountSummary/, accountSummaryAction);
settings.action(/closeAccountSummary/, closeAccountSummaryAction);

module.exports = settings;

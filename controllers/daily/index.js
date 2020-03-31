const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { dailyRecordSaveAction } = require('./actions');
const { checkDailySteps, checkDailyKms, clearSession, isAlreadyHasRecord } = require('./helpers');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const daily = new Scene('daily');

daily.enter(async (ctx) => {
    const isAlreadyHas = await isAlreadyHasRecord(ctx);
    if (isAlreadyHas) {
        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('scenes.daily.already_has_record'), mainKeyboard);
        ctx.scene.leave();
    } else {
        const { backKeyboard } = getBackKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('scenes.daily.enter_daily_steps'), backKeyboard);
    }
});

daily.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard(ctx);
    clearSession(ctx);
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

daily.hears(match('keyboards.back_keyboard.back'), leave());

daily.on('text', async (ctx) => {
    if (typeof ctx.session.dailySteps === 'undefined') {
        if (checkDailySteps(ctx)) {
            await ctx.reply(ctx.i18n.t('scenes.daily.enter_daily_kms'));
            return;
        } else {
            await ctx.reply(ctx.i18n.t('scenes.daily.format_wrong'));
            return;
        }
    } else {
        if (checkDailyKms(ctx)) {
            await dailyRecordSaveAction(ctx);
            await ctx.reply(ctx.i18n.t('scenes.daily.thanks'));
            ctx.scene.leave();
        } else {
            await ctx.reply(ctx.i18n.t('scenes.daily.format_wrong'));
            return;
        }
    }
});

daily.command('saveme', leave());

module.exports = daily;

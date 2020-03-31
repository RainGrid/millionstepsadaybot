const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {
    getDailyStatisticsAction,
    getYesterdayStatisticsAction,
    getWeeklyStatisticsAction,
    getMonthlyStatisticsAction,
    getYearlyStatisticsAction
} = require('./actions');
const { getStatisticsKeyboard } = require('./helpers');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const satistics = new Scene('statistics');

let isRedirect = false;

satistics.enter(async (ctx) => {
    const { backKeyboard } = getBackKeyboard(ctx);

    await ctx.reply(ctx.i18n.t('scenes.statistics.statistics'), backKeyboard);
    await ctx.reply(ctx.i18n.t('scenes.statistics.welcome'), getStatisticsKeyboard(ctx));
});

satistics.leave(async (ctx) => {
    if (!isRedirect) {
        const { mainKeyboard } = getMainKeyboard(ctx);

        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    }
});

satistics.command('saveme', leave());
satistics.hears(match('keyboards.back_keyboard.back'), leave());

satistics.action(/getDailyStatistics/, getDailyStatisticsAction);
satistics.action(/getYesterdayStatistics/, getYesterdayStatisticsAction);
satistics.action(/getWeeklyStatistics/, getWeeklyStatisticsAction);
satistics.action(/getMonthlyStatistics/, getMonthlyStatisticsAction);
satistics.action(/getYearlyStatistics/, getYearlyStatisticsAction);
satistics.action(/startDailyScene/, async (ctx) => {
    isRedirect = true;
    await ctx.scene.enter('daily')
});
satistics.action(/back/, leave());

module.exports = satistics;

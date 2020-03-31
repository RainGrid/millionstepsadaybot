const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {
    getDailyRatingsAction,
    getTotalRatingsAction
} = require('./actions');
const { getRatingsKeyboard } = require('./helpers');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const ratings = new Scene('ratings');

let isRedirect = false;

ratings.enter(async (ctx) => {
    const { backKeyboard } = getBackKeyboard(ctx);

    await ctx.reply(ctx.i18n.t('scenes.ratings.ratings'), backKeyboard);
    await ctx.reply(ctx.i18n.t('scenes.ratings.welcome'), getRatingsKeyboard(ctx));
});

ratings.leave(async (ctx) => {
    if (!isRedirect) {
        const { mainKeyboard } = getMainKeyboard(ctx);

        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    }
});

ratings.command('saveme', leave());
ratings.hears(match('keyboards.back_keyboard.back'), leave());

ratings.action(/getDailyRatings/, getDailyRatingsAction);
ratings.action(/getTotalRatings/, getTotalRatingsAction);

ratings.action(/back/, leave());

module.exports = ratings;

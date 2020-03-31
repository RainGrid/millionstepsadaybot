const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { locationSendAction } = require('./actions');
const { getLocationKeyboard } = require('./helpers');
const { getMainKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const location = new Scene('location');

location.enter(async (ctx) => {
    await ctx.reply(ctx.i18n.t('scenes.location.ask_for_location'), getLocationKeyboard(ctx));
});

location.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard(ctx);

    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});


location.on('location', async (ctx) => {
    await locationSendAction(ctx);
    await ctx.reply(ctx.i18n.t('scenes.location.thanks'));
    ctx.scene.leave();
});

location.hears(match('scenes.location.decline'), leave())
location.hears(match('keyboards.back_keyboard.back'), leave());

location.command('saveme', leave());

module.exports = location;

const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { sendMessage } = require('./helpers');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const contact = new Scene('contact');

contact.enter(async (ctx) => {

    const { backKeyboard } = getBackKeyboard(ctx);

    await ctx.reply(ctx.i18n.t('scenes.contact.write_to_admin'), backKeyboard);
});

contact.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

contact.command('saveme', leave());
contact.hears(match('keyboards.back_keyboard.back'), leave());

contact.on('text', async (ctx) => {
    await sendMessage(ctx);
    await ctx.reply(ctx.i18n.t('scenes.contact.message_delivered'));
    ctx.scene.leave();
});

module.exports = contact;

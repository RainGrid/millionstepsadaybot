const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { match } = require('telegraf-i18n');
const { getMainKeyboard, getBackKeyboard } = require('../../util/keyboards');
const { write, getStats, getHelp } = require('./helpers');

const { leave } = Stage;
const admin = new Scene('admin');

admin.enter(async (ctx) => {
    const { backKeyboard } = getBackKeyboard(ctx);

    await ctx.reply('Welcome to Admin stage', backKeyboard);
});

admin.leave(async (ctx) => {
    const { mainKeyboard } = getMainKeyboard(ctx);

    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

admin.command('saveme', leave());
admin.hears(match('keyboards.back_keyboard.back'), leave());

admin.on('text', async (ctx) => {
    const [type, ...params] = ctx.message.text.split(' | ');

    switch (type) {
        case 'write':
            await write(ctx, params[0], params[1]);
            break;
        case 'stats':
            await getStats(ctx);
            break;
        case 'help':
            await getHelp(ctx);
            break;
        default:
            ctx.reply('Command was not specified');
    }
});

module.exports = admin;
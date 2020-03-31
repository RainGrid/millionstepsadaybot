const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { languageChangeAction } = require('./actions');
const { getLanguageKeyboard } = require('./helpers');
const User = require('../../models/User');
const { getMainKeyboard } = require('../../util/keyboards');

const { leave } = Stage;
const start = new Scene('start');

let isRedirect = false;

start.enter(async (ctx) => {
    const uid = String(ctx.from.id);
    const user = await User.findOne({ telegram_id: uid });
    const { mainKeyboard } = getMainKeyboard(ctx);

    if (user) {
        await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
    } else {
        const now = new Date().getTime();

        const newUser = new User({
            telegram_id: uid,
            username: ctx.from.username,
            name: ctx.from.first_name + ' ' + ctx.from.last_name,
            lastActivity: now
        });

        await newUser.save();
        await ctx.reply('Choose language / Выбери язык', getLanguageKeyboard());
    }
});

start.leave(async (ctx) => {
    if (!isRedirect) {
        const { mainKeyboard } = getMainKeyboard(ctx);

        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    }
});

start.command('saveme', leave());
start.action(/languageChange/, languageChangeAction);
start.action(/confirmAccount/, async (ctx) => {
    await ctx.answerCbQuery();
    isRedirect = true;
    ctx.scene.enter('location');
});

module.exports = start;

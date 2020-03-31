require('dotenv').config()
require('./models');

const path = require('path');
const Telegraf = require('telegraf');
const cron = require('node-cron');
const SocksAgent = require('socks5-https-client/lib/Agent');
const TelegrafI18n = require('telegraf-i18n');
const { match } = require('telegraf-i18n');
const Stage = require('telegraf/stage.js');
const session = require('telegraf/session.js');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const about = require('./controllers/about/index.js');
const startScene = require('./controllers/start/index.js');
const dailyScene = require('./controllers/daily/index.js');
const locationScene = require('./controllers/location/index.js');
const statisticsScene = require('./controllers/statistics/index.js');
const ratingsScene = require('./controllers/ratings/index.js');
const settingsScene = require('./controllers/settings/index.js');
const contactScene = require('./controllers/contact/index.js');
const adminScene = require('./controllers/admin/index.js');
const { requestUsersActivity } = require('./util/notifier.js');
const asyncWrapper = require('./util/error-handler.js');
const { getMainKeyboard } = require('./util/keyboards.js');
const { updateLanguage } = require('./util/language.js');
const { updateUserTimestamp } = require('./middlewares/update-user-timestamp.js');
const { getUserInfo } = require('./middlewares/user-info.js');
const { isAdmin } = require('./middlewares/is-admin.js');
const Telegram = require('./telegram.js');

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useFindAndModify: false
});
mongoose.connection.on('error', error => {
    console.error(
        `Error occurred during an attempt to establish connection with the database: %O`,
        error
    );
    process.exit(1);
});

mongoose.connection.on('open', () => {
    const socksAgent = new SocksAgent({
        socksHost: process.env.PROXY_URL,
        socksPort: process.env.PROXY_PORT,
        socksUsername: process.env.PROXY_LOGIN,
        socksPassword: process.env.PROXY_PASS,
    });
    const bot = new Telegraf(process.env.BOT_TOKEN,
        {
            telegram: {
                agent: socksAgent
            }
        });
    const stage = new Stage([
        startScene,
        dailyScene,
        locationScene,
        statisticsScene,
        ratingsScene,
        settingsScene,
        contactScene,
        adminScene
    ]);
    const i18n = new TelegrafI18n({
        defaultLanguage: 'ru',
        directory: path.resolve(__dirname, 'locales'),
        useSession: true,
        allowMissing: false,
        sessionName: 'session'
    });

    bot.use(session());
    bot.use(i18n.middleware());
    bot.use(stage.middleware());
    bot.use(getUserInfo);

    bot.command('saveme', async (ctx) => {
        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    });
    bot.start(asyncWrapper(async (ctx) => ctx.scene.enter('start')));
    bot.action(
        /startDailyScene/,
        updateUserTimestamp,
        asyncWrapper(async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.scene.enter('daily');
        })
    );
    bot.hears(
        match('keyboards.main_keyboard.statistics'),
        updateUserTimestamp,
        asyncWrapper(async (ctx) => await ctx.scene.enter('statistics'))
    );
    bot.hears(
        match('keyboards.main_keyboard.ratings'),
        updateUserTimestamp,
        asyncWrapper(async (ctx) => await ctx.scene.enter('ratings'))
    );
    bot.hears(
        match('keyboards.main_keyboard.settings'),
        updateUserTimestamp,
        asyncWrapper(async (ctx) => await ctx.scene.enter('settings'))
    );
    bot.hears(match('keyboards.main_keyboard.about'), updateUserTimestamp, asyncWrapper(about));
    bot.hears(
        match('keyboards.main_keyboard.contact'),
        updateUserTimestamp,
        asyncWrapper(async (ctx) => await ctx.scene.enter('contact'))
    );
    bot.hears(
        match('keyboards.back_keyboard.back'),
        asyncWrapper(async (ctx) => {
            const { mainKeyboard } = getMainKeyboard(ctx);

            await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
        })
    );

    bot.hears(
        /(.*admin)/,
        isAdmin,
        asyncWrapper(async (ctx) => await ctx.scene.enter('admin'))
    );

    bot.hears(/(.*?)/, async (ctx) => {
        const user = await User.findOne({ telegram_id: ctx.from.id });
        await updateLanguage(ctx, user.language);

        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('other.default_handler'), mainKeyboard);
    });

    bot.catch((error) => {
        console.log('Global error has happened, %O', error);
    });

    cron.schedule('0 10-21 * * * *', () => {
        requestUsersActivity();
    });

    requestUsersActivity();

    bot.startPolling();
});

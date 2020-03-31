const moment = require('moment');
const moment_tz = require('moment-timezone');
const User = require('../../models/User');
const DailyRecord = require('../../models/DailyRecord');

exports.getDailyStatisticsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let today = moment().startOf('day');
        const record = await DailyRecord.findOne({ user: user._id, createdAt: { $gte: today.toDate() } });
        if (record) {
            await ctx.reply(ctx.i18n.t('scenes.statistics.daily') + ' ' + ctx.i18n.t('scenes.statistics.total', { steps: record.stepsCount, kms: roundDecimals(record.kilometers, 2) }));
        } else {
            await ctx.reply(ctx.i18n.t('scenes.statistics.empty'));
        }
    }
    await ctx.answerCbQuery();
};

exports.getYesterdayStatisticsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let start = moment().add(-1, 'days').startOf('day');
        let end = moment().add(-1, 'days').endOf('day');
        const record = await DailyRecord.findOne({ user: user._id, createdAt: { $gte: start.toDate(), $lte: end.toDate() } });
        if (record) {
            await ctx.reply(ctx.i18n.t('scenes.statistics.yesterday') + ' ' + ctx.i18n.t('scenes.statistics.total', { steps: record.stepsCount, kms: roundDecimals(record.kilometers, 2) }));
        } else {
            await ctx.reply(ctx.i18n.t('scenes.statistics.empty'));
        }
    }
    await ctx.answerCbQuery();
};

exports.getWeeklyStatisticsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let start = moment().startOf('isoWeek');
        let end = moment().endOf('isoWeek');
        const records = await DailyRecord.find({ user: user._id, createdAt: { $gte: start.toDate(), $lte: end.toDate() } });
        if (records.length) {
            let stepsSum = 0;
            let kmsSum = 0;
            records.forEach(el => {
                stepsSum += el.stepsCount;
                kmsSum += el.kilometers;
            })
            await ctx.reply(ctx.i18n.t('scenes.statistics.weekly') + ' ' + ctx.i18n.t('scenes.statistics.total', { steps: stepsSum, kms: roundDecimals(kmsSum, 2) }));
        } else {
            await ctx.reply(ctx.i18n.t('scenes.statistics.empty'));
        }
    }
    await ctx.answerCbQuery();
};

exports.getMonthlyStatisticsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let start = moment().startOf('month');
        let end = moment().endOf('month');
        const records = await DailyRecord.find({ user: user._id, createdAt: { $gte: start.toDate(), $lte: end.toDate() } });
        if (records.length) {
            let stepsSum = 0;
            let kmsSum = 0;
            records.forEach(el => {
                stepsSum += el.stepsCount;
                kmsSum += el.kilometers;
            })
            await ctx.reply(ctx.i18n.t('scenes.statistics.monthly') + ' ' + ctx.i18n.t('scenes.statistics.total', { steps: stepsSum, kms: roundDecimals(kmsSum, 2) }));
        } else {
            await ctx.reply(ctx.i18n.t('scenes.statistics.empty'));
        }
    }
    await ctx.answerCbQuery();
};

exports.getYearlyStatisticsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let start = moment().startOf('year');
        let end = moment().endOf('year');
        const records = await DailyRecord.find({ user: user._id, createdAt: { $gte: start.toDate(), $lte: end.toDate() } });
        if (records.length) {
            let stepsSum = 0;
            let kmsSum = 0;
            records.forEach(el => {
                stepsSum += el.stepsCount;
                kmsSum += el.kilometers;
            })
            await ctx.reply(ctx.i18n.t('scenes.statistics.yearly') + ' ' + ctx.i18n.t('scenes.statistics.total', { steps: stepsSum, kms: roundDecimals(kmsSum, 2) }));
        } else {
            await ctx.reply(ctx.i18n.t('scenes.statistics.empty'));
        }
    }
    await ctx.answerCbQuery();
};

function roundDecimals(number, count) {
    return Math.round((number + Number.EPSILON) * Math.pow(10, count)) / Math.pow(10, count);
}

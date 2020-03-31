const moment = require('moment');
const moment_tz = require('moment-timezone');
const User = require('../../models/User');
const DailyRecord = require('../../models/DailyRecord');

exports.getDailyRatingsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let today = moment().startOf('day');
        const records = await DailyRecord.find({ createdAt: { $gte: today.toDate() } }).populate('user').sort({ stepsCount: -1 });
        if (records) {
            const currentUserRecord = records.find(record => record.user.id === user.id);
            const currentUserIndex = records.findIndex(record => record.user.id === user.id);
            let answer = '';
            records.slice(0, 3).forEach((record, index) => {
                answer += ctx.i18n.t('scenes.ratings.user_placement', {
                    place: index + 1,
                    username: record.user.username || "неизвестно",
                    stepsCount: record.stepsCount
                });
                answer += '\n';
            })
            if (currentUserRecord) {
                answer += '\n';
                answer += ctx.i18n.t('scenes.ratings.your_placement', {
                    place: currentUserIndex + 1,
                    stepsCount: currentUserRecord.stepsCount
                });
            }
            await ctx.reply(answer);
        } else {
            await ctx.reply(ctx.i18n.t('scenes.ratings.empty'));
        }
    }
    await ctx.answerCbQuery();
};

exports.getTotalRatingsAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let records = await DailyRecord.aggregate([
            {
                $group: {
                    '_id': '$user',
                    'stepsCount': { $sum: '$stepsCount' },
                    'user': { $first: '$user' }
                }
            },
            {
                $sort: { 'stepsCount': -1 }
            }
        ]);
        records = await User.populate(records, { path: 'user' });
        if (records) {
            const currentUserRecord = records.find(record => record.user.id === user.id);
            const currentUserIndex = records.findIndex(record => record.user.id === user.id);
            let answer = '';
            records.slice(0, 3).forEach((record, index) => {
                answer += ctx.i18n.t('scenes.ratings.user_placement', {
                    place: index + 1,
                    username: record.user.username || "неизвестно",
                    stepsCount: record.stepsCount
                });
                answer += '\n';
            })
            if (currentUserRecord) {
                answer += '\n';
                answer += ctx.i18n.t('scenes.ratings.your_placement', {
                    place: currentUserIndex + 1,
                    stepsCount: currentUserRecord.stepsCount
                });
            }
            await ctx.reply(answer);
        } else {
            await ctx.reply(ctx.i18n.t('scenes.ratings.empty'));
        }
    }
    await ctx.answerCbQuery();
};

function roundDecimals(number, count) {
    return Math.round((number + Number.EPSILON) * Math.pow(10, count)) / Math.pow(10, count);
}

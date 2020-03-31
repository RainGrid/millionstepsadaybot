const moment = require('moment');
const moment_tz = require('moment-timezone');
const { saveToSession, deleteFromSession } = require('../../util/session');
const User = require('../../models/User');
const DailyRecord = require('../../models/DailyRecord');

exports.isAlreadyHasRecord = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user) {
        let today = null;
        if (user.timezone) {
            today = moment();
        } else {
            today = moment();
        }
        today = today.startOf('day');
        const record = await DailyRecord.find({ user: user._id, createdAt: { $gte: today.toDate() } });
        if (record.length) {
            return true;
        }
    }
    return false;
}

exports.checkDailySteps = (ctx) => {
    if (ctx.message.text && Number.isInteger(parseInt(ctx.message.text)) && parseInt(ctx.message.text) > 0 && parseInt(ctx.message.text) < 100000) {
        saveToSession(ctx, 'dailySteps', parseInt(ctx.message.text));
        return true;
    }
    return false;
}

exports.checkDailyKms = (ctx) => {
    if (!ctx.message.text) {
        return false;
    }
    const text = ctx.message.text.replace(',', '.');
    if (typeof parseFloat(text) === 'number' && parseFloat(text) > 0 && parseFloat(text) < 265) {
        saveToSession(ctx, 'dailyKms', parseFloat(text));
        return true;
    }
    return false;
}

exports.clearSession = (ctx) => {
    deleteFromSession(ctx, 'dailySteps');
    deleteFromSession(ctx, 'dailyKms');
}


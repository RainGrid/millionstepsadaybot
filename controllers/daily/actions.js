const User = require('../../models/User');
const DailyRecord = require('../../models/DailyRecord');

exports.dailyRecordSaveAction = async (ctx) => {
    const user = await User.findOne({ telegram_id: ctx.from.id });
    if (user && ctx.session.dailySteps && ctx.session.dailyKms) {
        const newRecord = new DailyRecord({
            stepsCount: ctx.session.dailySteps,
            kilometers: ctx.session.dailyKms,
            user: user
        })
        await newRecord.save();
    }
};
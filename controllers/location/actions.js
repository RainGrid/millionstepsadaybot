const User = require('../../models/User');
const geoTz = require('geo-tz')

exports.locationSendAction = async (ctx) => {
    if (ctx.message.location) {
        const user = await User.findOne({telegram_id: ctx.from.id});
        if (user) {
            await User.findOneAndUpdate(
                { telegram_id: ctx.from.id },
                {
                    location: ctx.message.location,
                    timezone: geoTz(ctx.message.location.latitude, ctx.message.location.longitude)[0]
                },
                { new: true }
            );
        }
    }
};
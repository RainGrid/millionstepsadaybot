const telegram = require('../../telegram');

exports.sendMessage = async function (ctx) {
    const msg = `From: ${JSON.stringify(ctx.from)}.\n\nMessage: ${ctx.message.text}`;

    await telegram.sendMessage(process.env.ADMIN_ID, msg);
}

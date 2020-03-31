const { Telegram } = require('telegraf');
const SocksAgent = require('socks5-https-client/lib/Agent');

const socksAgent = new SocksAgent({
    socksHost: process.env.PROXY_URL,
    socksPort: process.env.PROXY_PORT,
    socksUsername: process.env.PROXY_LOGIN,
    socksPassword: process.env.PROXY_PASS,
});
const telegram = new Telegram(process.env.BOT_TOKEN, { agent: socksAgent });
module.exports = telegram;
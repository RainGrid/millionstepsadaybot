const moment = require('moment');
const { Extra } = require('telegraf');
const telegram = require('../telegram.js');
const User = require('../models/User');
const DailyRecord = require('../models/DailyRecord');

function getProposeKeyboard() {
    return Extra.HTML().markup((m) =>
        m.inlineKeyboard(
            [
                [
                    m.callbackButton(
                        'Начать',
                        JSON.stringify({ a: 'startDailyScene' }),
                        false
                    )

                ]
            ],
            {}
        )
    );
}


exports.requestUsersActivity = async function () {
    const users = await User.find();
    if (users && users.length) {
        users.forEach(user => {
            isAlreadyHasRecord(user.id)
                .then(has => {
                    if (!has) {
                        telegram.sendMessage(user.telegram_id, 'Пора делиться результатами!\nЕсли сейчас нет времени, всегда можно записать результат в разделе Моя статистика', getProposeKeyboard())
                            .then(result => {
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        })
    }
}

async function isAlreadyHasRecord(user_id) {
    let today = moment().startOf('day');
    const record = await DailyRecord.find({ user: user_id, createdAt: { $gte: today.toDate() } });
    if (record.length) {
        return true;
    }
    return false;
}
const { Markup } = require('telegraf');

exports.getBackKeyboard = (ctx) => {
    const backKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back');
    let backKeyboard = Markup.keyboard([backKeyboardBack]);

    backKeyboard = backKeyboard.resize().extra();

    return {
        backKeyboard,
        backKeyboardBack
    };
};

exports.getMainKeyboard = (ctx) => {
    const mainKeyboardStatistics = ctx.i18n.t('keyboards.main_keyboard.statistics');
    const mainKeyboardRatings = ctx.i18n.t('keyboards.main_keyboard.ratings');
    const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings');
    const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
    const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact');
    let mainKeyboard = Markup.keyboard([
        [mainKeyboardStatistics, mainKeyboardRatings],
        [mainKeyboardSettings, mainKeyboardAbout],
        [mainKeyboardContact]
    ]);

    mainKeyboard = mainKeyboard.resize().extra();

    return {
        mainKeyboard,
        mainKeyboardStatistics,
        mainKeyboardRatings,
        mainKeyboardSettings,
        mainKeyboardAbout,
        mainKeyboardContact
    };
};
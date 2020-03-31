const about = async (ctx) => {
    await ctx.reply(ctx.i18n.t('scenes.about.main'), {
        disable_web_page_preview: true
    });
};

module.exports = about;
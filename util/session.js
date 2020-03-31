exports.saveToSession = function (ctx, field, data) {
    ctx.session[field] = data;
}

exports.deleteFromSession = function (ctx, field) {
    if (!ctx.session || !ctx.session[field]) return;
    delete ctx.session[field];
}
const { compareTwoStrings } = require('string-similarity');

exports.sleep = function (sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

exports.isNumberInRage = function (number, base, step = 1) {
    return number >= base - step && number <= base + step;
}

exports.checkStringSimilarity = function (a, b) {
    const first = a.toLocaleLowerCase();
    const second = b.toLocaleLowerCase();

    if (first === second) return true;

    return compareTwoStrings(first, second) >= 0.75;
}
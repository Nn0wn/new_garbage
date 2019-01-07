"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomRangeInt(min, max) {
    if (min === void 0) { min = 0; }
    return Math.floor(Math.random() * Math.floor(max - min + 1) + min);
}
exports.getRandomRangeInt = getRandomRangeInt;
function getRandomInt(max) {
    return getRandomRangeInt(0, max);
}
exports.getRandomInt = getRandomInt;

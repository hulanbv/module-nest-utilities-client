"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
/** Create a hash code from a string */
const hash = (from) => (from.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
}, 0) >>> 0).toString();
exports.hash = hash;
//# sourceMappingURL=hash.js.map
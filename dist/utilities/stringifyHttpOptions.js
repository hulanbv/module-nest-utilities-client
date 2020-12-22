"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyHttpOptions = void 0;
const nest_utilities_client_1 = require("nest-utilities-client");
/**
 * Turns an HTTP options object into a string. Generally useful when comparing.
 * @param options http options
 * @param ids model ids
 */
function stringifyHttpOptions(options, ids) {
    // Define a character to join stringified nested options.
    const joinChar = '&';
    // Create a shadow variable for `ids`. Sort defined ids so the result is comparable.*
    const _ids = ids ? ids.sort().join('_') : '';
    // Join ids and result, filter falsey values (like empty strings) and return
    return [_ids, nest_utilities_client_1.recordToParams(options).join(joinChar)]
        .filter(Boolean)
        .join('?');
}
exports.stringifyHttpOptions = stringifyHttpOptions;
// * Sorting is applied, so that different option objects with the same values but in a different order will result in the same output string.
//# sourceMappingURL=stringifyHttpOptions.js.map
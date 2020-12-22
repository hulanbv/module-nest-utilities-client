"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePost = void 0;
const useRequest_1 = require("./core/useRequest");
/**
 * Use a to-be-created model. Povides a post call that creates a new instance of the given body.
 * @param service
 * @param httpOptions
 */
function usePost(service, httpOptions = {}, stateOptions = {}) {
    const _a = useRequest_1.useRequest(service, '', 'POST', httpOptions, stateOptions), { data, response, call } = _a, rest = __rest(_a, ["data", "response", "call"]);
    return Object.assign({ data: data, response: response, call }, rest);
}
exports.usePost = usePost;
//# sourceMappingURL=usePost.js.map
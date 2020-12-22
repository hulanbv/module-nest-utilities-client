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
exports.useMany = void 0;
const react_1 = require("react");
const useRequest_1 = require("./core/useRequest");
/**
 * Use multiple models by their id
 * @param service
 * @param ids
 * @param httpOptions
 * @param immediateFetch fetch models on initialization -- default true
 */
function useMany(service, ids = [], httpOptions = {}, stateOptions = {}) {
    const { immediateFetch = true } = stateOptions;
    const _httpOptions = Object.assign(Object.assign({}, httpOptions), { filter: Object.assign(Object.assign({}, httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.filter), { _id: { $in: ids } }) });
    const _a = useRequest_1.useRequest(service, '', 'GET', _httpOptions, stateOptions), { data, response, call } = _a, rest = __rest(_a, ["data", "response", "call"]);
    react_1.useEffect(() => {
        if (immediateFetch && ids.length > 0)
            call();
    }, []);
    return Object.assign({ data: data, response: response, call }, rest);
}
exports.useMany = useMany;
//# sourceMappingURL=useMany.js.map
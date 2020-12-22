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
exports.useById = void 0;
const react_1 = require("react");
const useRequest_1 = require("./core/useRequest");
/**
 * Use a model by id
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
function useById(service, id, httpOptions = {}, stateOptions = {}) {
    const { immediateFetch = true } = stateOptions;
    const _a = useRequest_1.useRequest(service, id, 'GET', httpOptions, stateOptions), { data, response, call } = _a, rest = __rest(_a, ["data", "response", "call"]);
    react_1.useEffect(() => {
        if (immediateFetch && id)
            call();
    }, [id]);
    return Object.assign({ data: data, response: response, call }, rest);
}
exports.useById = useById;
//# sourceMappingURL=useById.js.map
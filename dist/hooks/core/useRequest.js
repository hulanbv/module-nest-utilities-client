"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequest = void 0;
const react_1 = require("react");
const hash_1 = require("../../utilities/hash");
const RequestState_1 = require("../../utilities/RequestState");
const stringifyHttpOptions_1 = require("../../utilities/stringifyHttpOptions");
const queryMap = new Map();
let postStates = 0;
let deleteStates = 0;
/**
 * Returns a unique method id for POST and DELETE requests.
 */
function createUniqueMethodId(method) {
    switch (method) {
        case 'POST':
            return postStates++;
        case 'DELETE':
            return deleteStates++;
        case 'GET':
        case 'PUT':
        case 'PATCH':
            return null;
    }
}
/**
 * Use a crud request.
 * @param service CRUD service
 * @param query fetch query
 * @param method fetch method
 * @param httpOptions http options
 * @param proxyMethod proxy method
 * @param cache enable caching through local storage
 */
function useRequest(service, query, method = 'GET', httpOptions = {}, stateOptions = {}) {
    // Extract request options
    const { proxyMethod, cache = false } = stateOptions;
    // Create a shadow variable for `cache` so its value won't change.
    const _cache = react_1.useRef(cache);
    // Create a unique id for the given method.
    const methodId = react_1.useRef(createUniqueMethodId(method));
    // Create a state hash string.
    const stateHash = react_1.useMemo(() => hash_1.hash([
        service.controller,
        _cache.current.toString(),
        method,
        query || methodId.current,
    ]
        .filter(Boolean)
        .join('')), [method, query, service.controller]);
    const stringifiedHttpOptions = stringifyHttpOptions_1.stringifyHttpOptions(httpOptions);
    const httpOptionsHash = react_1.useMemo(() => hash_1.hash(stringifiedHttpOptions), [
        stringifiedHttpOptions,
    ]);
    /**
     * Create a new RequestState instance
     */
    const createRequestState = react_1.useCallback(() => new RequestState_1.RequestState(service, method, query, httpOptions, proxyMethod, _cache.current), 
    // We do not need httpOptions as a dependency, because we know `httpOptionsHash` will change every time http options change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, httpOptionsHash, method, proxyMethod, query]);
    /**
     * Get the query state for given state and options hashes.
     * Returns an existing query state or creates one.
     */
    const getRequestState = react_1.useCallback((stateHash, optionsHash) => {
        var _a, _b;
        // Get the child map from `queryMap` for the given `stateHash`,
        // or create and get it if it does not exist
        const stateMap = (_a = queryMap.get(stateHash)) !== null && _a !== void 0 ? _a : queryMap.set(stateHash, new Map()).get(stateHash);
        // Get the query state from `stateMap` for the given `optionsHash`
        // or create and get it if it does not exist
        const queryState = (_b = stateMap.get(optionsHash)) !== null && _b !== void 0 ? _b : stateMap.set(optionsHash, createRequestState()).get(optionsHash);
        return queryState;
    }, [createRequestState]);
    // Get the query state for `stateHash` and `httpOptionsHash`
    const queryState = react_1.useMemo(() => getRequestState(stateHash, httpOptionsHash), [stateHash, httpOptionsHash, getRequestState]);
    // Initiate state variables, derived from the current `queryState` properties.
    const [data, setData] = react_1.useState(queryState.data);
    const [fetchState, setFetchState] = react_1.useState(queryState.fetchState);
    const [response, setResponse] = react_1.useState(queryState.response);
    // Every time `queryState` changes...
    // (hook arguments must have been changed, therefor a different RequestState was used)
    react_1.useEffect(() => {
        // Add a change listener to our `queryState`, that syncs our state variables
        queryState.addChangeListener((state) => {
            setData(state.data);
            setFetchState(state.fetchState);
            setResponse(state.response);
        });
        // Clean up the listener when this effect is terminated.
        return () => queryState.clearChangeListener();
    }, [queryState]);
    return {
        cacheKey: queryState.cacheKey,
        call: queryState.update,
        data,
        fetchState,
        response,
        service,
    };
}
exports.useRequest = useRequest;
//# sourceMappingURL=useRequest.js.map
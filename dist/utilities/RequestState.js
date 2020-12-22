"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _changeHandlers, _fetchState, _data, _response;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestState = void 0;
const types_1 = require("../types");
const hash_1 = require("./hash");
const stringifyHttpOptions_1 = require("./stringifyHttpOptions");
/**
 * Manages a fetch request and provides information about this request, like the response, its data and it's current fetch state.
 */
class RequestState {
    constructor(
    /** CRUD service (nest-utilities-client). */
    service, 
    /** Fetch method. */
    method, 
    /** Request query (for example, `<id>` in `"api/users/<id>"`). */
    query = '', 
    /** HTTP options. */
    httpOptions = {}, 
    /** When defined, enables proxy calls with the given method. */
    proxyMethod, 
    /** Determines wether response data should be kept in local storage.
     * If a `string` is passed, it will use this as key name.
     * Otherwise a hash is created from other parameters.
     * */
    cache = false) {
        var _a;
        this.service = service;
        this.method = method;
        this.query = query;
        this.httpOptions = httpOptions;
        this.proxyMethod = proxyMethod;
        this.cache = cache;
        _changeHandlers.set(this, []);
        _fetchState.set(this, types_1.FetchState.Idle);
        _data.set(this, void 0);
        _response.set(this, void 0);
        /** Promise resolvers for subsequent update calls. */
        this.subsequentCallResolvers = [];
        /**
         * Update this instance. Will execute a fetch call determined by it's given method.
         * @param body request body
         * @param useProxy use proxy method
         */
        this.update = (body, useProxy) => __awaiter(this, void 0, void 0, function* () {
            // Check if this instance is already fetching and stop immediately subsequent calls.
            // This prevents multiple hooks that use this instance from executing the same fetch call multiple times.
            if (this.fetchState === types_1.FetchState.Pending) {
                // Return a promise that will get resolved by the `handleUpdate` method
                return yield new Promise((resolve) => this.subsequentCallResolvers.push(resolve));
            }
            // Update fetch state to pending since we are going to fetch soon.
            this.handleUpdate(() => {
                __classPrivateFieldSet(this, _fetchState, types_1.FetchState.Pending);
            });
            // Determine the fetch method
            const method = this.getFetchMethod(useProxy);
            // A body is required for post, put and patch requests.
            const bodyRequiredMethods = ['POST', 'PUT', 'PATCH'];
            // Determine if a body is required for our `method`.
            const bodyRequired = bodyRequiredMethods.includes(method);
            // Create a variable to store our response in.
            let response;
            try {
                // If a fetch body is required (for create and update methods), but not defined, throw an error.
                if (bodyRequired && !body)
                    this.throwNoBodyError(method);
                if (body instanceof Promise) {
                    // Handle custom promise...
                    response = yield this.handleCustomPromise(body);
                }
                else {
                    // Handle every fetch method...
                    if (method === 'GET') {
                        response = this.query
                            ? yield this.service.get(this.query, this.httpOptions)
                            : yield this.service.getAll(this.httpOptions);
                    }
                    if (method === 'POST') {
                        response = yield this.service.post(body, this.httpOptions);
                    }
                    if (method === 'PATCH') {
                        response = yield this.service.patch(body, this.httpOptions);
                    }
                    if (method === 'PUT') {
                        response = yield this.service.put(body, this.httpOptions);
                    }
                    if (method === 'DELETE') {
                        response = yield this.service.delete(this.query);
                    }
                }
                // Update this instance.
                this.handleUpdate(() => {
                    // After succesfully executing the fetch call, update the related instance properties.
                    // We can safely cast the response type since all fetch methods are accounted for.
                    __classPrivateFieldSet(this, _fetchState, types_1.FetchState.Fulfilled);
                    this.setResponse(response);
                    this.setData(response.data);
                });
                return true;
            }
            catch (error) {
                // Inform the developer of our error.
                console.error(error);
                this.handleUpdate(() => {
                    __classPrivateFieldSet(this, _fetchState, types_1.FetchState.Rejected);
                    this.setData(null);
                    // Set our response if it's actually a response and not anything else created by `catch`.
                    this.setResponse(error instanceof Response ? error.data : null);
                });
                return false;
            }
        });
        if (cache) {
            // Create a hash from constructor parameters.
            const hashId = hash_1.hash([method, query, stringifyHttpOptions_1.stringifyHttpOptions(httpOptions)]
                .filter(Boolean)
                .join(''));
            // Create a local storage key name -- prefixed so it is recognizable when debugging
            this.cacheKey = [
                RequestState.cacheKeyNamePrefix,
                typeof cache === 'string' ? cache : hashId,
            ].join(':');
            // Set initial data from local storage, or null
            __classPrivateFieldSet(this, _data, (_a = JSON.parse(localStorage.getItem(this.cacheKey) || 'null')) !== null && _a !== void 0 ? _a : null);
        }
    }
    // Current response data
    get data() {
        return __classPrivateFieldGet(this, _data) || null;
    }
    // Current fetch state
    get fetchState() {
        return __classPrivateFieldGet(this, _fetchState);
    }
    // Current fetch response
    get response() {
        return __classPrivateFieldGet(this, _response) || null;
    }
    handleCustomPromise(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield promise;
        });
    }
    /**
     * Sets #response property.
     * @param to value to set to
     */
    setResponse(to) {
        __classPrivateFieldSet(this, _response, to !== null && to !== void 0 ? to : void 0);
    }
    /**
     * Sets #data property.
     * @param to value to set to
     */
    setData(to) {
        __classPrivateFieldSet(this, _data, to);
        if (this.cache) {
            localStorage.setItem(this.cacheKey, JSON.stringify(__classPrivateFieldGet(this, _data)));
        }
    }
    /**
     * Determine this state's fetch method.
     * @param useProxy account for proxy method
     */
    getFetchMethod(useProxy = false) {
        return useProxy && this.proxyMethod ? this.proxyMethod : this.method;
    }
    /**
     * Throws an error describing a missing request body.
     * @param method fetch method
     */
    throwNoBodyError(method) {
        throw new Error(`Body is undefined for ${method} ${this.service.controller}`);
    }
    /**
     * Update this instance, resolve any subsequent calls and tell change listeners this instance has updated.
     * @param updater updater function
     */
    handleUpdate(updater) {
        // Run the updater callback.
        updater();
        // Execute change handlers
        __classPrivateFieldGet(this, _changeHandlers).forEach((handler) => handler(this));
        // Resolve any subsequent calls
        this.subsequentCallResolvers.forEach((resolve) => {
            if (this.fetchState === types_1.FetchState.Fulfilled)
                resolve(true);
            if (this.fetchState === types_1.FetchState.Rejected)
                resolve(false);
        });
    }
    /**
     * Append a change listener to this RequestState instance. The callback function will be executed on any instance update.
     * @param callback callback function
     */
    addChangeListener(callback) {
        __classPrivateFieldGet(this, _changeHandlers).push(callback);
    }
    /**
     * Removes all change listeners from this instance.
     */
    clearChangeListener() {
        __classPrivateFieldSet(this, _changeHandlers, []);
    }
}
exports.RequestState = RequestState;
_changeHandlers = new WeakMap(), _fetchState = new WeakMap(), _data = new WeakMap(), _response = new WeakMap();
RequestState.cacheKeyNamePrefix = 'nest-utilities-client-hooks';
//# sourceMappingURL=RequestState.js.map
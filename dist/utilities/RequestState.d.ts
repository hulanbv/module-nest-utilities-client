import { CrudService, IHttpOptions, IResponse } from 'nest-utilities-client';
import { FetchMethod, FetchState, GetServiceModel, IModel, ResponseData } from '../types';
/**
 * Manages a fetch request and provides information about this request, like the response, its data and it's current fetch state.
 */
export declare class RequestState<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>> {
    #private;
    /** CRUD service (nest-utilities-client). */
    readonly service: Service;
    /** Fetch method. */
    private method;
    /** Request query (for example, `<id>` in `"api/users/<id>"`). */
    private query;
    /** HTTP options. */
    private httpOptions;
    /** When defined, enables proxy calls with the given method. */
    private proxyMethod?;
    /** Determines wether response data should be kept in local storage.
     * If a `string` is passed, it will use this as key name.
     * Otherwise a hash is created from other parameters.
     * */
    private cache;
    private static cacheKeyNamePrefix;
    cacheKey?: string;
    constructor(
    /** CRUD service (nest-utilities-client). */
    service: Service, 
    /** Fetch method. */
    method: FetchMethod, 
    /** Request query (for example, `<id>` in `"api/users/<id>"`). */
    query?: string, 
    /** HTTP options. */
    httpOptions?: IHttpOptions<IModel>, 
    /** When defined, enables proxy calls with the given method. */
    proxyMethod?: "POST" | "GET" | "PATCH" | "PUT" | "DELETE" | undefined, 
    /** Determines wether response data should be kept in local storage.
     * If a `string` is passed, it will use this as key name.
     * Otherwise a hash is created from other parameters.
     * */
    cache?: boolean | string);
    get data(): ResponseData<Model>;
    get fetchState(): FetchState;
    get response(): (IResponse<import("../types").FetchError> & {
        ok: false;
    }) | (IResponse<Model | null> & {
        ok: true;
    }) | null;
    /** Promise resolvers for subsequent update calls. */
    private subsequentCallResolvers;
    /**
     * Update this instance. Will execute a fetch call determined by it's given method.
     * @param body request body
     * @param useProxy use proxy method
     */
    update: (body?: Promise<IResponse<ResponseData<Model>>> | Partial<Model> | FormData | null | undefined, useProxy?: boolean | undefined) => Promise<boolean>;
    private handleCustomPromise;
    /**
     * Sets #response property.
     * @param to value to set to
     */
    private setResponse;
    /**
     * Sets #data property.
     * @param to value to set to
     */
    private setData;
    /**
     * Determine this state's fetch method.
     * @param useProxy account for proxy method
     */
    private getFetchMethod;
    /**
     * Throws an error describing a missing request body.
     * @param method fetch method
     */
    private throwNoBodyError;
    /**
     * Update this instance, resolve any subsequent calls and tell change listeners this instance has updated.
     * @param updater updater function
     */
    private handleUpdate;
    /**
     * Append a change listener to this RequestState instance. The callback function will be executed on any instance update.
     * @param callback callback function
     */
    addChangeListener(callback: (queryState: this) => void): void;
    /**
     * Removes all change listeners from this instance.
     */
    clearChangeListener(): void;
}

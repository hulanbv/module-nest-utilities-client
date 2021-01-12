import { CrudService, IHttpOptions, IResponse } from 'nest-utilities-client';
import {
  FetchMethod,
  FetchState,
  GetServiceModel,
  IModel,
  Response,
  ResponseData,
} from '../types';
import { hash } from './hash';
import { stringifyHttpOptions } from './stringifyHttpOptions';

/**
 * Manages a fetch request and provides information about this request, like the response, its data and it's current fetch state.
 */
export class RequestState<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
> {
  private static cacheKeyNamePrefix = 'nest-utilities-client-hooks';

  #changeHandlers: ((queryState: this) => void)[] = [];
  #fetchState: FetchState = FetchState.Idle;
  #data?: ResponseData<Model>;
  #response?: Response<Model>;
  cacheKey?: string;

  constructor(
    /** CRUD service (nest-utilities-client). */
    readonly service: Service,

    /** Fetch method. */
    private method: FetchMethod,

    /** Request query (for example, `<id>` in `"api/users/<id>"`). */
    private query: string = '',

    /** HTTP options. */
    private httpOptions: IHttpOptions<IModel> = {},

    /** When defined, enables proxy calls with the given method. */
    private proxyMethod?: FetchMethod,

    /** Determines wether response data should be kept in local storage.
     * If a `string` is passed, it will use this as key name.
     * Otherwise a hash is created from other parameters.
     * */
    private cache: boolean | string = false
  ) {
    if (cache) {
      // Create a hash from constructor parameters.
      const hashId = hash(
        [method, query, stringifyHttpOptions(httpOptions)]
          .filter(Boolean)
          .join('')
      );

      // Create a local storage key name -- prefixed so it is recognizable when debugging
      this.cacheKey = [
        RequestState.cacheKeyNamePrefix,
        typeof cache === 'string' ? cache : hashId,
      ].join(':');

      // Set initial data from local storage, or null
      this.#data =
        JSON.parse(localStorage.getItem(this.cacheKey) || 'null') ?? null;
    }
  }

  // Current response data
  get data() {
    return this.#data || null;
  }

  // Current fetch state
  get fetchState() {
    return this.#fetchState;
  }

  // Current fetch response
  get response() {
    return this.#response || null;
  }

  /** Promise resolvers for subsequent update calls. */
  private subsequentCallResolvers: ((value: boolean) => void)[] = [];

  /**
   * Update this instance. Will execute a fetch call determined by it's given method.
   * @param body request body
   * @param useProxy use proxy method
   */
  update = async (
    body?:
      | Promise<IResponse<ResponseData<Model>>>
      | Partial<Model>
      | FormData
      | null,
    useProxy?: boolean
  ): Promise<boolean> => {
    // Check if this instance is already fetching and stop immediately subsequent calls.
    // This prevents multiple hooks that use this instance from executing the same fetch call multiple times.
    if (this.fetchState === FetchState.Pending) {
      // Return a promise that will get resolved by the `handleUpdate` method
      return await new Promise<boolean>((resolve) =>
        this.subsequentCallResolvers.push(resolve)
      );
    }

    // Update fetch state to pending since we are going to fetch soon.
    this.handleUpdate(() => {
      this.#fetchState = FetchState.Pending;
    });

    // Determine the fetch method
    const method = this.getFetchMethod(useProxy);

    // A body is required for post, put and patch requests.
    const bodyRequiredMethods: FetchMethod[] = ['POST', 'PUT', 'PATCH'];

    // Determine if a body is required for our `method`.
    const bodyRequired = bodyRequiredMethods.includes(method);

    // Create a variable to store our response in.
    let response: IResponse<any>;

    try {
      // If a fetch body is required (for create and update methods), but not defined, throw an error.
      if (bodyRequired && !body) this.throwNoBodyError(method);

      // We can safely cast our body to a non-null Model type.
      // Missing or invalid body properties will (or should) be handled by the api server.
      type Body = Model | FormData;

      if (body instanceof Promise) {
        // Handle custom promise...
        response = await this.handleCustomPromise(body);
      } else {
        // Handle every fetch method...

        if (method === 'GET') {
          response = this.query
            ? await this.service.get(this.query, this.httpOptions)
            : await this.service.getAll(this.httpOptions);
        }

        if (method === 'POST') {
          response = await this.service.post(body as Body, this.httpOptions);
        }

        if (method === 'PATCH') {
          response = await this.service.patch(body as Body, this.httpOptions);
        }

        if (method === 'PUT') {
          response = await this.service.put(body as Body, this.httpOptions);
        }

        if (method === 'DELETE') {
          response = await this.service.delete(this.query);
        }
      }

      // Update this instance.
      this.handleUpdate(() => {
        // After succesfully executing the fetch call, update the related instance properties.
        // We can safely cast the response type since all fetch methods are accounted for.
        this.#fetchState = FetchState.Fulfilled;
        this.setResponse(response);
        this.setData(response.data);
      });

      return true;
    } catch (error) {
      // Inform the developer of our error.
      console.error(error);
      this.handleUpdate(() => {
        this.#fetchState = FetchState.Rejected;
        this.setData(null);

        // Set our response if it's actually a response and not anything else created by `catch`.
        this.setResponse(
          error instanceof Response
            ? { ...(error as IResponse<any>).data }
            : null
        );
      });

      return false;
    }
  };

  private async handleCustomPromise(
    promise: Promise<IResponse<any>>
  ): Promise<IResponse<any>> {
    return await promise;
  }

  /**
   * Sets #response property.
   * @param to value to set to
   */
  private setResponse(to: Response<Model> | null) {
    this.#response = to ?? void 0;
  }

  /**
   * Sets #data property.
   * @param to value to set to
   */
  private setData(to: ResponseData<Model>) {
    this.#data = to;

    if (this.cache) {
      localStorage.setItem(this.cacheKey!, JSON.stringify(this.#data));
    }
  }

  /**
   * Determine this state's fetch method.
   * @param useProxy account for proxy method
   */
  private getFetchMethod(useProxy: boolean = false): FetchMethod {
    return useProxy && this.proxyMethod ? this.proxyMethod : this.method;
  }

  /**
   * Throws an error describing a missing request body.
   * @param method fetch method
   */
  private throwNoBodyError(method: FetchMethod): never {
    throw new Error(
      `Body is undefined for ${method} ${this.service.controller}`
    );
  }

  /**
   * Update this instance, resolve any subsequent calls and tell change listeners this instance has updated.
   * @param updater updater function
   */
  private handleUpdate(updater: () => void) {
    // Run the updater callback.
    updater();

    // Execute change handlers
    this.#changeHandlers.forEach((handler) => handler(this));

    // Resolve any subsequent calls
    this.subsequentCallResolvers.forEach((resolve) => {
      if (this.fetchState === FetchState.Fulfilled) resolve(true);
      if (this.fetchState === FetchState.Rejected) resolve(false);
    });
  }

  /**
   * Append a change listener to this RequestState instance. The callback function will be executed on any instance update.
   * @param callback callback function
   */
  addChangeListener(callback: (queryState: this) => void) {
    this.#changeHandlers.push(callback);
  }

  /**
   * Removes all change listeners from this instance.
   */
  clearChangeListener() {
    this.#changeHandlers = [];
  }
}

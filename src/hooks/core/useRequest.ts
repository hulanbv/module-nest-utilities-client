import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hash } from '../../utilities/hash';
import { RequestState } from '../../utilities/RequestState';
import { stringifyHttpOptions } from '../../utilities/stringifyHttpOptions';
import {
  FetchMethod,
  GetServiceModel,
  IModel,
  IRequestState,
  IStateOptions,
  QueryMap,
} from './../../types';

const queryMap: QueryMap = new Map();

let postStates = 0;
let deleteStates = 0;
let distinctStates = 0;

/**
 * Returns a unique method id for POST and DELETE requests.
 */
function createUniqueMethodId(method: FetchMethod): number | null {
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

function createDistinctId(): number {
  return distinctStates++;
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
export function useRequest<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  query?: string,
  method: FetchMethod = 'GET',
  httpOptions: IHttpOptions<GetServiceModel<Service>> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model> {
  // Extract request options
  const {
    appendQuery,
    proxyMethod,
    cache = false,
    distinct = false,
  } = stateOptions;

  // Create a static cache key
  const cacheKey = useRef(cache);

  // Create a static method id for the given method.
  const methodId = useRef(createUniqueMethodId(method));

  // Create a static distinct id when state should be distinct.
  const distinctId = useRef(distinct ? createDistinctId() : null);

  // Create a state hash string.
  const stateHash = useMemo(
    () =>
      hash(
        [
          service.controller,
          cacheKey.current.toString(),
          method,
          query || methodId.current,
          distinctId.current,
        ]
          .filter(Boolean)
          .join('')
      ),
    [method, query, service.controller]
  );

  const stringifiedHttpOptions = stringifyHttpOptions(httpOptions);
  const httpOptionsHash = useMemo(() => hash(stringifiedHttpOptions), [
    stringifiedHttpOptions,
  ]);

  /**
   * Create a new RequestState instance
   */
  const createRequestState = useCallback(
    () =>
      new RequestState(
        service,
        method,
        query,
        httpOptions,
        proxyMethod,
        cacheKey.current,
        appendQuery
      ),
    // We do not need httpOptions as a dependency, because we know `httpOptionsHash` will change every time http options change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, httpOptionsHash, method, proxyMethod, query]
  );

  /**
   * Get the query state for given state and options hashes.
   * Returns an existing query state or creates one.
   */
  const getRequestState = useCallback(
    (stateHash: string, optionsHash: string): RequestState<Service, Model> => {
      // Get the child map from `queryMap` for the given `stateHash`,
      // or create and get it if it does not exist
      const stateMap =
        queryMap.get(stateHash) ??
        queryMap.set(stateHash, new Map()).get(stateHash)!;

      // Get the query state from `stateMap` for the given `optionsHash`
      // or create and get it if it does not exist
      const queryState =
        stateMap.get(optionsHash) ??
        stateMap.set(optionsHash, createRequestState()).get(optionsHash)!;

      return queryState;
    },
    [createRequestState]
  );

  // Get the query state for `stateHash` and `httpOptionsHash`
  const queryState = useMemo<RequestState<Service, Model>>(
    () => getRequestState(stateHash, httpOptionsHash),
    [stateHash, httpOptionsHash, getRequestState]
  );

  // Initiate state variables, derived from the current `queryState` properties.
  const [data, setData] = useState(queryState.data);
  const [fetchState, setFetchState] = useState(queryState.fetchState);
  const [response, setResponse] = useState(queryState.response);

  // Use debug effect for changes in:
  // service
  // query
  // method
  // httpOptions
  // stateOptions
  useEffect(() => {
    if (!stateOptions.debug) return;

    console.groupCollapsed(
      `Client state changed: ${service.controller} ${query}`
    );
    console.log('vars', {
      service,
      query,
      stateOptions,
      httpOptions,
      stringifiedHttpOptions,
      httpOptionsHash,
      queryState,
      _global: queryMap,
    });
    console.groupEnd();
  }, [stateOptions.debug, service, query, method, httpOptions, stateOptions]);

  // Every time `queryState` changes...
  // (hook arguments must have been changed, therefor a different RequestState was used)
  useEffect(() => {
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

import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { useEffect } from 'react';
import {
  FetchTiming,
  GetServiceModel,
  IModel,
  IRequestState,
  IStateOptions,
  Response,
} from '../types';
import { stringifyHttpOptions } from '../utilities/stringifyHttpOptions';
import { useRequest } from './core/useRequest';

/**
 * Use all models
 * @param service
 * @param httpOptions
 * @param stateOptions
 * @returns
 */
export function useAll<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  httpOptions: IHttpOptions<GetServiceModel<Service>> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model[]> {
  const { fetchTiming = FetchTiming.IMMEDIATE } = stateOptions;
  const { data, response, call, ...rest } = useRequest(
    service,
    '',
    'GET',
    httpOptions,
    stateOptions
  );

  const stringifiedHttpOptions = stringifyHttpOptions(httpOptions);

  useEffect(() => {
    if (!Object.keys(httpOptions).length) {
      console.warn(
        [
          'You are fetching ALL items without any filters or limit set.',
          'This can potentially lead to very large response data and put a considerable amount of strain on the API server.',
        ].join('\n')
      );
    }

    if (
      fetchTiming === FetchTiming.IMMEDIATE ||
      (fetchTiming === FetchTiming.WHEN_EMPTY && !data)
    )
      call();
  }, [stringifiedHttpOptions]);

  return {
    data: data as Model[],
    response: response as Response<Model[]>,
    call,
    ...rest,
  };
}

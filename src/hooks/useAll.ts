import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { useEffect } from 'react';
import {
  GetServiceModel,
  IModel,
  IStateOptions,
  IRequestState,
  Response,
} from '../types';
import { useRequest } from './core/useRequest';

/**
 * Use all models
 * @param service
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export function useAll<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  httpOptions: IHttpOptions<Model> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model[]> {
  const { immediateFetch = true } = stateOptions;
  const { data, response, call, ...rest } = useRequest(
    service,
    '',
    'GET',
    httpOptions,
    stateOptions
  );

  useEffect(() => {
    if (!Object.keys(httpOptions).length) {
      console.warn(
        [
          'You are fetching ALL items without any filters or limit set.',
          'This can potentially lead to very large response data and put a considerable amount of strain on the API server.',
        ].join('\n')
      );
    }

    if (immediateFetch) call();
  }, [httpOptions]);

  return {
    data: data as Model[],
    response: response as Response<Model[]>,
    call,
    ...rest,
  };
}

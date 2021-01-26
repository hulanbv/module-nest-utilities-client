import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { useEffect } from 'react';
import { stringifyHttpOptions } from '../utilities/stringifyHttpOptions';
import {
  GetServiceModel,
  IModel,
  IStateOptions,
  IRequestState,
  Response,
} from '../types';
import { useRequest } from './core/useRequest';

/**
 * Use multiple models by their id
 * @param service
 * @param ids
 * @param httpOptions
 * @param immediateFetch fetch models on initialization -- default true
 */
export function useMany<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  ids: string[] = [],
  httpOptions: IHttpOptions<GetServiceModel<Service>> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model[]> {
  const { immediateFetch = true } = stateOptions;
  const _httpOptions: IHttpOptions<GetServiceModel<Service>> = {
    ...httpOptions,
    filter: {
      ...httpOptions?.filter,
      _id: { $in: ids },
    },
  };

  const { data, response, call, ...rest } = useRequest(
    service,
    '',
    'GET',
    _httpOptions,
    stateOptions
  );

  const stringifiedHttpOptions = stringifyHttpOptions(_httpOptions);

  useEffect(() => {
    if (immediateFetch && ids.length > 0) call();
  }, [stringifiedHttpOptions]);

  return {
    data: data as Model[],
    response: response as Response<Model[]>,
    call,
    ...rest,
  };
}

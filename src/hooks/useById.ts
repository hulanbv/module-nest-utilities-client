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
 * Use a model by id
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export function useById<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  id?: string,
  httpOptions: IHttpOptions<Model> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model> {
  const { immediateFetch = true } = stateOptions;
  const { data, response, call, ...rest } = useRequest(
    service,
    id,
    'GET',
    httpOptions,
    stateOptions
  );

  useEffect(() => {
    if (immediateFetch && id) call();
  }, [id]);

  return {
    data: data as Model,
    response: response as Response<Model>,
    call,
    ...rest,
  };
}

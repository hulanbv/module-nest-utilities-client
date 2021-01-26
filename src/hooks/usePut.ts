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
 * Use a model by id. Provides a put call that overwrites the instance of the given model with the provided body.
 * The model to overwrite is defined with by the (_)id in the body object.
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export function usePut<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  id?: string,
  httpOptions?: IHttpOptions<GetServiceModel<Service>>,
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model> {
  const { immediateFetch = true } = stateOptions;
  const { data, response, call, ...rest } = useRequest(
    service,
    id,
    'PUT',
    httpOptions,
    {
      ...stateOptions,
      proxyMethod: 'GET',
    }
  );

  useEffect(() => {
    if (immediateFetch && !!id) call(null, true);
  }, []);

  return {
    data: data as Model,
    response: response as Response<Model>,
    call,
    ...rest,
  };
}

import { CrudService, IHttpOptions } from 'nest-utilities-client';
import {
  GetServiceModel,
  IModel,
  IRequestState,
  IStateOptions,
  Response,
} from '../types';
import { useRequest } from './core/useRequest';

/**
 * Use a to-be-created model. Povides a post call that creates a new instance of the given body.
 * @param service
 * @param httpOptions
 */
export function usePost<
  Service extends CrudService<IModel>,
  Model extends IModel = GetServiceModel<Service>
>(
  service: Service,
  httpOptions: IHttpOptions<GetServiceModel<Service>> = {},
  stateOptions: IStateOptions = {}
): IRequestState<Service, Model, Model> {
  const { data, response, call, ...rest } = useRequest(
    service,
    '',
    'POST',
    httpOptions,
    stateOptions
  );

  return {
    data: data as Model,
    response: response as Response<Model>,
    call,
    ...rest,
  };
}

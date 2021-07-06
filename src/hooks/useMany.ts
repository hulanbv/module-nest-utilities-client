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
 * Use multiple models by their id
 * @param service
 * @param ids
 * @param httpOptions
 * @param stateOptions
 * @returns
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
  const { fetchTiming = FetchTiming.IMMEDIATE } = stateOptions;
  const _httpOptions: IHttpOptions<GetServiceModel<Service>> = {
    ...httpOptions,
    match: {
      ...httpOptions?.match,
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
    if (
      ids.length > 0 &&
      (fetchTiming === FetchTiming.IMMEDIATE ||
        (fetchTiming === FetchTiming.WHEN_EMPTY && !data))
    ) {
      call();
    }
  }, [stringifiedHttpOptions]);

  return {
    data: data as Model[],
    response: response as Response<Model[]>,
    call,
    ...rest,
  };
}

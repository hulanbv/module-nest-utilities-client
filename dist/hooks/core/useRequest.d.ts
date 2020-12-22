import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { IModel, FetchMethod, GetServiceModel, IStateOptions, IRequestState } from './../../types';
/**
 * Use a crud request.
 * @param service CRUD service
 * @param query fetch query
 * @param method fetch method
 * @param httpOptions http options
 * @param proxyMethod proxy method
 * @param cache enable caching through local storage
 */
export declare function useRequest<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, query?: string, method?: FetchMethod, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model>;

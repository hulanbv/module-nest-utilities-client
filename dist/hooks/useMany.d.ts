import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IStateOptions, IRequestState } from '../types';
/**
 * Use multiple models by their id
 * @param service
 * @param ids
 * @param httpOptions
 * @param immediateFetch fetch models on initialization -- default true
 */
export declare function useMany<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, ids?: string[], httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model[]>;

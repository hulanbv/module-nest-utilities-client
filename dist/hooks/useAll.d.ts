import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IStateOptions, IRequestState } from '../types';
/**
 * Use all models
 * @param service
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export declare function useAll<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model[]>;

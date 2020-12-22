import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IStateOptions, IRequestState } from '../types';
/**
 * Use a model by id and provides a delete call
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export declare function useDelete<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, id?: string, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model>;

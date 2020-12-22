import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IStateOptions, IRequestState } from '../types';
/**
 * Use a model by id. Provides a put call that overwrites the instance of the given model with the provided body.
 * The model to overwrite is defined with by the (_)id in the body object.
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export declare function usePut<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, id?: string, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model>;

import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IStateOptions, IRequestState } from '../types';
/**
 * Use a model by id, provides a patch call that merges the provided body with the instance of the given model in the database.
 * The model to overwrite is defined with by the (_)id in the body object.
 * @param service
 * @param id
 * @param httpOptions
 * @param immediateFetch fetch the model by id on initialization -- default true
 */
export declare function usePatch<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, id?: string, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model>;

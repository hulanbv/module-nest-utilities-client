import { CrudService, IHttpOptions } from 'nest-utilities-client';
import { GetServiceModel, IModel, IRequestState, IStateOptions } from '../types';
/**
 * Use a to-be-created model. Povides a post call that creates a new instance of the given body.
 * @param service
 * @param httpOptions
 */
export declare function usePost<Service extends CrudService<IModel>, Model extends IModel = GetServiceModel<Service>>(service: Service, httpOptions?: IHttpOptions<Model>, stateOptions?: IStateOptions): IRequestState<Service, Model, Model>;

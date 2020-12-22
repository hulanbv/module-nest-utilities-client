import { CrudService, IResponse } from 'nest-utilities-client';
import { RequestState } from './utilities/RequestState';
export interface IModel extends Record<string, any> {
}
export declare type FetchUpdateMethod = 'PATCH' | 'PUT';
export declare type FetchMethod = 'POST' | 'GET' | FetchUpdateMethod | 'DELETE';
export declare enum FetchState {
    Fulfilled = 0,
    Idle = 1,
    Pending = 2,
    Rejected = 3
}
export declare type FetchError = {
    error: string;
    message: string | string[];
    statusCode: number;
};
export declare type ResponseData<Model extends IModel | null> = Model[] | Model | null;
declare type RejectedResponse = IResponse<FetchError> & {
    ok: false;
};
declare type SuccesfulResponse<Data> = IResponse<Data | null> & {
    ok: true;
};
export declare type Response<Data> = SuccesfulResponse<Data> | RejectedResponse;
export declare type GetServiceModel<Service extends CrudService<IModel>> = ReturnType<Service['get']> extends Promise<infer Response> ? Response extends IResponse<infer Model> ? Model : never : never;
export declare type GetArrayType<From extends Array<any>> = From extends Array<infer T> ? T : never;
export declare type GetSingleModel<From extends IModel | IModel[]> = From extends IModel[] ? GetArrayType<From> : IModel;
export interface IStateOptions {
    cache?: boolean | string;
    immediateFetch?: boolean;
    proxyMethod?: FetchMethod;
}
declare type SimplePromise = Promise<boolean>;
export interface IStateUpdater<Service extends CrudService<IModel>> {
    (body?: Promise<IResponse<ResponseData<GetServiceModel<Service>>>>, proxy?: boolean): SimplePromise;
    (body?: Partial<GetServiceModel<Service>>, proxy?: boolean): SimplePromise;
    (body?: FormData, proxy?: boolean): SimplePromise;
    (body: null, proxy?: boolean): SimplePromise;
}
export interface IRequestState<Service extends CrudService<IModel>, Model extends IModel, ExpectedResponseData extends Model | Model[] = Model | Model[]> {
    cacheKey?: string;
    data: ExpectedResponseData | null;
    fetchState: FetchState;
    response: Response<ExpectedResponseData> | null;
    service: Service;
    call: IStateUpdater<Service>;
}
export declare type QueryMap = Map<string, Map<string, RequestState<any, any>>>;
export {};

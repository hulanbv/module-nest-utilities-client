import { CrudService, IResponse } from 'nest-utilities-client';
import { RequestState } from './utilities/RequestState';

/* Base types */
export interface IModel extends Record<string, any> {}
export type FetchUpdateMethod = 'PATCH' | 'PUT';
export type FetchMethod = 'POST' | 'GET' | FetchUpdateMethod | 'DELETE';

export enum FetchState {
  Fulfilled,
  Idle,
  Pending,
  Rejected,
}

export type FetchError = {
  error: string;
  message: string | string[];
  statusCode: number;
};

export type ResponseData<Model extends IModel | null> = Model[] | Model | null;

type RejectedResponse = IResponse<FetchError> & {
  ok: false;
};

type SuccesfulResponse<Data> = IResponse<Data | null> & {
  ok: true;
};

export type Response<Data> = SuccesfulResponse<Data> | RejectedResponse;

/* Utility types */

export type GetServiceModel<Service extends CrudService<IModel>> = ReturnType<
  Service['get']
> extends Promise<infer Response>
  ? Response extends IResponse<infer Model>
    ? Model
    : never
  : never;

export type GetArrayType<From extends Array<any>> = From extends Array<infer T>
  ? T
  : never;

export type GetSingleModel<
  From extends IModel | IModel[]
> = From extends IModel[] ? GetArrayType<From> : IModel;

/* Hook types */
export enum FetchTiming {
  /**
   * Fetches the data immediately after initiating the hook
   */
  IMMEDIATE,

  /**
   * Fetches the data when the call method is called
   */
  ON_CALL,

  /**
   * Fetches the data immediately after initiating the hook only when the data is empty.
   * The data could be hydrated via various sources including the cache option.
   */
  WHEN_EMPTY,
}
export interface IStateOptions {
  /** Create a distinct state e.g. do *not* use matching existing state */
  distinct?: boolean;
  /** Cache with generated or speficic key */
  cache?: boolean | string;
  /** Fetch immediately on hook creation */
  fetchTiming?: FetchTiming;
  /** Proxy method */
  proxyMethod?: FetchMethod;
  /** Log request state info */
  debug?: boolean;
  /** Request payload body property to append the given query to */
  appendQuery?: string;
}

type SimplePromise = Promise<boolean>;

export interface IStateUpdater<Service extends CrudService<IModel>> {
  (
    body?: Promise<IResponse<ResponseData<GetServiceModel<Service>>>>,
    proxy?: boolean
  ): SimplePromise;
  (body?: Partial<GetServiceModel<Service>>, proxy?: boolean): SimplePromise;
  (body?: FormData, proxy?: boolean): SimplePromise;
  (body: null, proxy?: boolean): SimplePromise;
}

export interface IRequestState<
  Service extends CrudService<IModel>,
  Model extends IModel,
  ExpectedResponseData extends Model | Model[] = Model | Model[]
> {
  cacheKey?: string;
  data: ExpectedResponseData | null;
  fetchState: FetchState;
  response: Response<ExpectedResponseData> | null;
  service: Service;
  call: IStateUpdater<Service>;
}

/* Global state type */
export type QueryMap = Map<string, Map<string, RequestState<any, any>>>;

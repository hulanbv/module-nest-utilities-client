import { IHttpOptions } from 'nest-utilities-client';
/**
 * Turns an HTTP options object into a string. Generally useful when comparing.
 * @param options http options
 * @param ids model ids
 */
export declare function stringifyHttpOptions(options: IHttpOptions<any>, ids?: string[]): string;

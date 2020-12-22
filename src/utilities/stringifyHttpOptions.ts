import { IHttpOptions, recordToParams } from 'nest-utilities-client';

/**
 * Turns an HTTP options object into a string. Generally useful when comparing.
 * @param options http options
 * @param ids model ids
 */
export function stringifyHttpOptions(
  options: IHttpOptions<any>,
  ids?: string[]
): string {
  // Define a character to join stringified nested options.
  const joinChar = '&';

  // Create a shadow variable for `ids`. Sort defined ids so the result is comparable.*
  const _ids = ids ? ids.sort().join('_') : '';

  // Join ids and result, filter falsey values (like empty strings) and return
  return [_ids, recordToParams(options).join(joinChar)]
    .filter(Boolean)
    .join('?');
}

// * Sorting is applied, so that different option objects with the same values but in a different order will result in the same output string.

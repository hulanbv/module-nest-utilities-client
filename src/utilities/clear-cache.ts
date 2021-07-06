import { RequestState } from './RequestState';

/**
 * clears all cache stored by nest-utilities-client-stat
 */
export const clearCache = () => {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(RequestState.cacheKeyNamePrefix)) {
      localStorage.removeItem(key);
    }
  }
};

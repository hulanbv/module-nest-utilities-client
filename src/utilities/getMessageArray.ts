import { FetchError } from 'types';

export function getMessageArray(from: FetchError): string[] {
  if (from.message instanceof Array) return from.message;
  return [from.message];
}

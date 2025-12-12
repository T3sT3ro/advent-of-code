import { zip } from 'es-toolkit';

export function transpose<T>(...vectors: T[][]) {
    return zip(...vectors);
}

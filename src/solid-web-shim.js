export * from '@solidjs/web?original';

export function use(fn, element, value) {
  return fn(element, () => value);
}

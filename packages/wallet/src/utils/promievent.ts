import { EventEmitter } from 'events';

export default class PromiEvent<T> extends EventEmitter implements Promise<T> {
  private readonly promise: Promise<T>;
  readonly [Symbol.toStringTag]: 'Promise';
  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    super();
    // @ts-ignore
    this.promise = new Promise<T>(executor);
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ) {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ) {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null) {
    return this.promise.finally(onfinally);
  }

  static resolve<T = any>(value: T) {
    return new PromiEvent(resolve1 => resolve1(value));
  }

  static reject<T = any>(reason: T) {
    return new PromiEvent((_, reject) => reject(reason));
  }
}

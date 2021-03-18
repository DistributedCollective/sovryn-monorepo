/// <reference types="node" />
import { EventEmitter } from 'events';
export default class PromiEvent<T> extends EventEmitter implements Promise<T> {
    private readonly promise;
    readonly [Symbol.toStringTag]: 'Promise';
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
    static resolve<T = any>(value: T): PromiEvent<unknown>;
    static reject<T = any>(reason: T): PromiEvent<unknown>;
}

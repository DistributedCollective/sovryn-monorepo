import { Debugger } from 'debug';
export declare function debug(namespace: string): {
    log: Debugger;
    error: Debugger;
};
export default debug;

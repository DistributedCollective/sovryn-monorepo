import _debug, { Debugger } from 'debug';

export function debug(namespace: string): { log: Debugger; error: Debugger } {
  const error = _debug(`${namespace}:error`);
  const log = _debug(`${namespace}`);

  error.log = console.error.bind(console);
  log.log = console.info.bind(console);

  return {
    log,
    error,
  };
}

export default debug;
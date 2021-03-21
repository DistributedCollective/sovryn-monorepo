import * as React from 'react';
import {
  ProviderType,
  LedgerWalletProvider,
  ChainCodeResponse,
} from '@sovryn/wallet';
import { walletService } from '../../services';
import { Dialog } from '../Dialog';

interface Props {
  chainId?: number;
  onComplete: (
    response: ChainCodeResponse,
    chainId: number,
    dPath: string,
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function LedgerConnector(props: Props) {
  const [chainId, setChainId] = React.useState(props.chainId || 30);
  const [path, setPath] = React.useState('');

  const [state, setState] = React.useState({
    chainId: props.chainId || 30, // makes RSK (30) default selection
    dPath: '',
    loading: false,
    error: '',
  });

  const networks = React.useMemo(() => {
    return walletService.networkDictionary.list();
  }, [props.chainId]);
  const networkName = React.useMemo(() => {
    return walletService.networkDictionary.get(chainId)?.getName();
  }, [chainId]);

  const paths = React.useMemo(() => {
    const networks = walletService.networkDictionary.get(chainId);
    if (!networks) return [];
    return networks.getWalletDPaths(ProviderType.LEDGER) || [];
  }, [chainId]);

  React.useEffect(() => {
    let path = state.dPath;

    if (!paths?.length) {
      path = '';
    } else if (paths?.length && !state.dPath) {
      path = paths[0].path;
    }

    setState(prevState => ({
      ...prevState,
      dPath: path,
    }));
  }, [state.dPath, paths]);

  const onSubmit = React.useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    try {
      const response = await LedgerWalletProvider.getChainCode(state.dPath);
      props.onComplete(response, state.chainId, state.dPath);
    } catch (e) {
      console.error(e);
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: prettifyErrorMessage(e),
      }));
    }
  }, [state]);

  return (
    <Dialog onClose={props.onClose} isOpen={props.isOpen}>
      <h1>Choose App</h1>
      <p>Please choose the App you have opened in Ledger</p>
      {!props.chainId && (
        <div>
          <div>
            <label htmlFor='network'>Choose a network:</label>
          </div>
          <select
            id='network'
            value={chainId}
            onChange={e => setChainId(Number(e.currentTarget.value))}
          >
            {networks.map(item => (
              <option value={item.getChainId()} key={item.getChainId()}>
                {item.getName()}
              </option>
            ))}
          </select>
        </div>
      )}

      {paths?.length ? (
        <div>
          <div>
            <label htmlFor='path'>Direviration path:</label>
          </div>
          <select
            id='path'
            value={path}
            onChange={e => setPath(e.currentTarget.value)}
          >
            {paths.map(item => (
              <option value={item.path} key={item.path}>
                {item.label} - {item.path}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          Dapp doesn't have any ledger paths for{' '}
          {networkName || 'selected network'}
        </div>
      )}

      {state.error && <div>{state.error}</div>}

      <button
        onClick={onSubmit}
        disabled={!state.chainId || !state.dPath || state.loading}
      >
        Next
      </button>
    </Dialog>
  );
}

function prettifyErrorMessage({ message }: Error) {
  if (message.includes('TransportInterfaceNotAvailable')) {
    return "Unable to connect to device - make sure it's not used in another site.";
  }

  // if (message.includes('0x6a80')) {
  //   return 'Ledger device is locked.';
  // }

  if (message.includes('0x6700')) {
    return 'Open app in your ledger device.';
  }

  if (message.includes('0x6804')) {
    return 'Device is locked or wrong app used.';
  }

  return message;
}

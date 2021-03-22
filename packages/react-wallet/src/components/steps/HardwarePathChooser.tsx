import * as React from 'react';
import {
  ChainCodeResponse,
  ProviderType,
  LedgerWalletProvider,
  TrezorWalletProvider,
} from '@sovryn/wallet';
import { walletService } from '../../services';
import { Dialog } from '../Dialog';

interface Props {
  chainId?: number;
  provider: ProviderType;
  onComplete: (
    response: ChainCodeResponse,
    chainId: number,
    dPath: string,
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function HardwarePathChooser(props: Props) {
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
    return walletService.networkDictionary.get(state.chainId)?.getName();
  }, [state.chainId]);

  const paths = React.useMemo(() => {
    const networks = walletService.networkDictionary.get(state.chainId);
    if (!networks) return [];
    return networks.getWalletDPaths(props.provider) || [];
  }, [state.chainId, props.provider]);

  React.useEffect(() => {
    let path = state.dPath;

    if (!paths?.length) {
      path = '';
    } else if (
      (paths?.length && !state.dPath) ||
      (paths?.length &&
        state.dPath &&
        !paths.find(item => item.path === state.dPath))
    ) {
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
      await walletService.start(props.provider);
      const response = await getChainCode(props.provider, state.dPath);
      props.onComplete(response, state.chainId, state.dPath);
    } catch (e) {
      console.error(e);
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: prettifyErrorMessage(e, props.provider),
      }));
    }
  }, [state, props.provider]);

  const onChangeChain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setState(prevState => ({
      ...prevState,
      chainId: Number(value),
    }));
  };

  const onChangePath = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setState(prevState => ({
      ...prevState,
      dPath: value,
    }));
  };

  return (
    <Dialog onClose={props.onClose} isOpen={props.isOpen}>
      <h1>{getTitle(props.provider)}</h1>
      {!props.chainId && (
        <div>
          <div>
            <label htmlFor='network'>Choose a network:</label>
          </div>
          <select id='network' value={state.chainId} onChange={onChangeChain}>
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
            <label htmlFor='path'>Derivation path:</label>
          </div>
          <select id='path' value={state.dPath} onChange={onChangePath}>
            {paths.map(item => (
              <option value={item.path} key={item.path}>
                {item.label} - {item.path}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          Dapp doesn't have any {getDeviceName(props.provider)} paths for{' '}
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

function prettifyErrorMessage({ message }: Error, provider: ProviderType) {
  if (provider === ProviderType.LEDGER) {
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
  }

  return message;
}

function getTitle(provider: ProviderType) {
  const titles = {
    [ProviderType.LEDGER]: 'Ledger',
    [ProviderType.TREZOR]: 'Trezor',
  };

  // eslint-disable-next-line no-prototype-builtins
  if (titles.hasOwnProperty(provider)) {
    return titles[provider];
  }

  return 'Choose Path';
}

function getDeviceName(provider: ProviderType) {
  const titles = {
    [ProviderType.LEDGER]: 'Ledger',
    [ProviderType.TREZOR]: 'Trezor',
  };

  // eslint-disable-next-line no-prototype-builtins
  if (titles.hasOwnProperty(provider)) {
    return titles[provider];
  }

  return 'Device';
}

function getChainCode(provider: ProviderType, dPath: string) {
  switch (provider) {
    case ProviderType.LEDGER:
      return LedgerWalletProvider.getChainCode(dPath);
    case ProviderType.TREZOR:
      return TrezorWalletProvider.getChainCode(dPath);
    default:
      throw Error('Unknown HD device.');
  }
}

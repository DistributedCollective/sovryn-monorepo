import * as React from 'react';
import {
  getDeterministicWallets,
  DeterministicWalletData,
} from '@sovryn/wallet';
import { toChecksumAddress } from 'ethereumjs-util';
import { Dialog } from '../Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chainId: number;
  seed?: string;
  dPath: string;
  chainCode?: string;
  publicKey?: string;
  limit?: number;
  onUnlock: (address: string, index: number) => void;
}

export function DeterministicWallets(props: Props) {
  const [state, setState] = React.useState<{
    offset: number;
    wallets: DeterministicWalletData[];
    selected: DeterministicWalletData;
  }>({
    offset: 0,
    wallets: [],
    selected: undefined as any,
  });

  React.useEffect(() => {
    const wallets = getDeterministicWallets({
      seed: props.seed,
      dPath: props.dPath,
      chainCode: props.chainCode,
      publicKey: props.publicKey,
      limit: props.limit || 10,
      offset: state.offset,
    }).map(item => ({
      index: item.index,
      address: toChecksumAddress(item.address, props.chainId),
    }));
    setState(prevState => ({ ...prevState, wallets }));
  }, [
    props.seed,
    props.dPath,
    props.chainCode,
    props.publicKey,
    props.limit,
    state.offset,
  ]);

  const onSelect = React.useCallback(
    (item: DeterministicWalletData) => {
      setState(prevState => ({ ...prevState, selected: item }));
    },
    [state],
  );

  const onUnlock = React.useCallback(() => {
    props.onUnlock(state.selected.address, state.selected.index);
  }, [state]);

  const onChangeOffset = React.useCallback(
    (offset: number) => {
      setState(prevState => ({ ...prevState, offset: offset }));
    },
    [state],
  );

  return (
    <Dialog onClose={props.onClose} isOpen={props.isOpen}>
      <h1>Choose Wallet</h1>
      {state.wallets.map(item => (
        <button key={item.address} onClick={() => onSelect(item)}>
          {item.index + 1}.{' '}
          {state.selected?.address === item.address ? '*' : ' '} {item.address}
        </button>
      ))}
      {state.wallets.length === 0 && (
        <div>
          No wallets in selected derivation path. Try changing path or app in
          your wallet.
        </div>
      )}
      <div>
        <div>
          <button
            onClick={() => onChangeOffset(state.offset - (props.limit || 10))}
            disabled={state.offset <= 0}
          >
            &lt; Back
          </button>
          <button
            onClick={() => onChangeOffset(state.offset + (props.limit || 10))}
          >
            Next &gt;
          </button>
        </div>
        <div>
          <button disabled={!state.selected} onClick={onUnlock}>
            Access My Wallet
          </button>
        </div>
      </div>
    </Dialog>
  );
}

DeterministicWallets.defaultProps = {
  limits: 10,
};

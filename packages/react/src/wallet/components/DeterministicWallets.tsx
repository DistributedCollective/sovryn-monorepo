import * as React from 'react';
import {
  getDeterministicWallets,
  DeterministicWalletData,
} from '@sovryn/wallet';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  seed?: string;
  dPath: string;
  chainCode?: string;
  publicKey?: string;
  limit?: number;
  dPaths: { value: string; label: string }[];
  onUnlock: (dPath: string, address: string, index: number) => void;
  onChangeDPath: (dPath: string) => void;
}

export function DeterministicWallets(props: Props) {
  const [state, setState] = useState<{
    offset: number;
    wallets: DeterministicWalletData[];
    selected: DeterministicWalletData;
  }>({
    offset: 0,
    wallets: [],
    selected: undefined as any,
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, wallets: [] }));

    const wallets = getDeterministicWallets({
      seed: props.seed,
      dPath: props.dPath,
      chainCode: props.chainCode,
      publicKey: props.publicKey,
      limit: props.limit || 10,
      offset: state.offset,
    });

    setState(prevState => ({ ...prevState, wallets }));
  }, [
    props.seed,
    props.dPath,
    props.chainCode,
    props.publicKey,
    props.limit,
    state.offset,
  ]);

  const onSelect = useCallback(
    (item: DeterministicWalletData) => {
      setState(prevState => ({ ...prevState, selected: item }));
    },
    [state],
  );

  const onUnlock = useCallback(() => {
    props.onUnlock(props.dPath, state.selected.address, state.selected.index);
  }, [state]);

  const onChangeOffset = useCallback(
    (offset: number) => {
      setState(prevState => ({ ...prevState, offset: offset }));
    },
    [state],
  );

  const onChangeDPath = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChangeDPath(event.currentTarget.value);
    },
    [],
  );

  return (
    <React.Fragment>
      <div>
        <select value={props.dPath} onChange={onChangeDPath}>
          {props.dPaths.map(item => (
            <option value={item.value} key={item.value}>
              {item.label} ({item.value})
            </option>
          ))}
        </select>
      </div>
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
            Back
          </button>
          <button
            onClick={() => onChangeOffset(state.offset + (props.limit || 10))}
          >
            Next
          </button>
        </div>
        <div>
          <button>Cancel</button>
          <button disabled={!state.selected} onClick={onUnlock}>
            Unlock
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

DeterministicWallets.defaultProps = {
  limits: 10,
};

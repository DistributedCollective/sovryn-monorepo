import * as React from 'react';
import {
  getDeterministicWallets,
  DeterministicWalletData,
} from '@sovryn/wallet';
import { useEffect, useState } from 'react';
import { DeterministicWallet } from '../../../../wallet/src/wallets/deterministic';

interface Props {
  seed?: string;
  dPath: string;
  chainCode?: string;
  publicKey?: string;
  limit?: number;
}

export function DeterministicWallets(props: Props) {
  const [state, setState] = useState<{
    offset: number;
    wallets: DeterministicWalletData[];
    selected: undefined
  }>({
    offset: 0,
    wallets: [],
    selected: DeterministicWallet as any,
  });

  useEffect(() => {
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

  return (
    <React.Fragment>
      {state.wallets.map(item => (
        <div key={item.address}>{item.address}</div>
      ))}
    </React.Fragment>
  );
}

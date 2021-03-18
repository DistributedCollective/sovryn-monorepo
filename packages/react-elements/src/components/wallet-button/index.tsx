import * as React from 'react';
import { Wallet } from '@sovryn/wallet';
import { useWallet } from './hooks';

const _wallet = new Wallet(31);

export function WalletButton() {
  const { wallet } = useWallet();

  const onConnect = React.useCallback(async () => {
    wallet.loading.set(true);
    const provider = await _wallet.connect('ledger');
    console.log('provider', provider);
  }, []);

  return (
    <React.Fragment>
      <button onClick={onConnect} disabled={wallet.loading.value}>
        {wallet.loading.value ? 'Connecting' : 'Connect'}
      </button>
    </React.Fragment>
  );
}

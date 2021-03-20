import * as React from 'react';
import { useWalletContext } from '../hooks';

export function WalletButton() {
  const context = useWalletContext();
  return (
    <button
      onClick={() => context.connect()}
      disabled={context.state.loading.value}
    >
      {context.state.loading.value ? 'Connecting' : 'Connect'}
    </button>
  );
}

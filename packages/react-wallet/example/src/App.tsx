import React from 'react'

import { WalletProvider } from '@sovryn/react-wallet';
import { Home } from './Home';

const App = () => {
  return <WalletProvider options={{ remember: true }} portalTargetId="root"><Home /></WalletProvider>
};

export default App

# @sovryn/react-wallet

[![NPM](https://img.shields.io/npm/v/@sovryn/react-wallet.svg)](https://www.npmjs.com/package/@sovryn/react-wallet) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @sovryn/react-wallet
```

## Usage

Wrap your app with the WalletProvider and use `React.useContext(WalletContext)` to get the current wallet connection state and useful functions.
Then either you use the WalletButton component to connect, call the connect function or the unlock functions from the WalletContext.

```tsx
import React, { Component, useContext } from 'react';

import { WalletProvider, WalletButton, WalletContext } from '@sovryn/react-wallet';
import '@sovryn/react-wallet/index.css'

class App extends Component {
  render() {
    return <WalletProvider options={chainId:30, remember: true}><Home /></WalletProvider>
  }
}

class Home extends Component {
  const { address } = useContext(WalletContext);
  render() {
    return <>{!address ? <WalletButton /> : <p>Connected with {address}</p>)}</>
  }
}

```

## License

MIT © [grinry](https://github.com/grinry)

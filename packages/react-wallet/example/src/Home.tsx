import React, { useCallback, useContext, useEffect } from 'react';

import {
  HardwareWallet,
  isHardwareWallet,
  Web3Node,
} from '@sovryn/wallet';
import {
  WalletButton,
  WalletContext,
  walletService,
} from '@sovryn/react-wallet';
import '@sovryn/react-wallet/index.css';

const node = new Web3Node('https://public-node.testnet.rsk.co');

export const Home = () => {
  const {
    address,
    connected,
    disconnect,
    chainId,
    provider,
  } = useContext(WalletContext);

  const sign = useCallback(async () => {
    try {
      const signed = await walletService.signMessage('abc');
      // const signed = await wallet.signMessage('test');
      console.log('signed', signed);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const verifyAddress = useCallback(async () => {
    try {
      const result = await (walletService.wallet as HardwareWallet).displayAddress();
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const send = useCallback(async () => {
    try {
      console.log('chain id: ', chainId, walletService.chainId);

      const run = async () => {
        const nonce = await node.getTransactionCount(walletService.address);
        const tx = await walletService.signTransaction({
          value: '0',
          to: walletService.address,
          chainId: walletService.chainId,
          nonce: nonce,
          gasPrice: '65164000',
          gasLimit: '21000',
        });

        console.log('send', tx);
      };

      run().catch(e => {
        console.error('failed to send tx', e);
      });
    } catch (e) {
      console.error(e);
    }
  }, [chainId]);

  const [balance, setBalance] = React.useState('0');

  useEffect(() => {
    if (address) {
      node
        .getBalance(address.toLowerCase())
        .then(setBalance)
        .catch(e => {
          console.error(e);
          setBalance('0');
        });
    } else {
      setBalance('0');
    }
  }, [address]);

  return (
    <div>
      {!connected && <WalletButton />}
      {connected && (
        <React.Fragment>
          <div>
            Connected: {address} ({balance})
            <button onClick={disconnect}>Disconnect</button>
          </div>
          <div>
            <button onClick={sign}>Sign message</button>
          </div>
          <div>
            <button onClick={send}>Send balance</button>
          </div>
          <div>
            <button
              onClick={verifyAddress}
              disabled={!(provider && isHardwareWallet(provider))}
            >
              Verify address
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

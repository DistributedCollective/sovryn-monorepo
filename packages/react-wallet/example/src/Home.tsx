import React, { useCallback, useContext, useEffect } from 'react';

import { HardwareWallet, isHardwareWallet, Web3Node } from '@sovryn/wallet';
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
    setOptions,
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

  const sendToChain = useCallback(async () => {
    try {
      const run = async () => {
        const nonce = await node.getTransactionCount(walletService.address);
        const tx = await walletService.signTransaction({
          value: '0',
          to: walletService.address,
          chainId: 31,
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
  }, []);

  const eth_signTypedData_v4 = useCallback(async () => {
    try {
      const result = await walletService.request({
        method: 'eth_signTypedData_v4',
        params: [
          address,
          JSON.stringify({
            domain: {
              chainId: 4,
              name: 'OrderBook',
              verifyingContract: address,
              version: '1',
            },
            message: {
              maker: address,
              fromToken: address,
              toToken: address,
              amountIn: '0',
              amountOutMin: '0',
              recipient: address,
              deadline: 123,
              created: 0,
            },
            primaryType: 'Order',
            types: {
              EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
              ],
              Order: [
                { name: 'maker', type: 'address' },
                { name: 'fromToken', type: 'address' },
                { name: 'toToken', type: 'address' },
                { name: 'amountIn', type: 'uint256' },
                { name: 'amountOutMin', type: 'uint256' },
                { name: 'recipient', type: 'address' },
                { name: 'deadline', type: 'uint256' },
                { name: 'created', type: 'uint256' },
              ],
            },
          }),
        ],
      });

      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }, [address]);

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
            <button onClick={sendToChain}>Send balance (31 chain)</button>
          </div>
          <div>
            <button onClick={eth_signTypedData_v4}>
              eth_signTypedData_v4 (Rinkeby network)
            </button>
          </div>
          <div>
            <button
              onClick={verifyAddress}
              disabled={!(provider && isHardwareWallet(provider))}
            >
              Verify address
            </button>
          </div>
          <div>Network: {chainId}</div>
        </React.Fragment>
      )}

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => setOptions({ viewType: 'default', hideTitle: false })}
        >
          Theme 1
        </button>
        <button
          onClick={() => setOptions({ viewType: 'gray', hideTitle: true })}
        >
          Theme 2
        </button>
      </div>
    </div>
  );
};

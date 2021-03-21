import Web3 from 'web3';
import { toChecksumAddress } from 'ethereumjs-util';
import debug from '../utils/debug';
import { Web3Wallet } from '../wallets/non-deterministic';
import { WalletProviderInterface, FullWallet } from '../interfaces';

const { log, error } = debug('injected-wallet');

export class InjectedWalletProvider implements WalletProviderInterface {
  provider: any;

  constructor() {
    log('constructing injected wallet provider.');
    const { ethereum } = window as any;
    if (ethereum) {
      log('has ethereum injected.');
      if ((window as any).Web3) {
        log('has web3 injected, overwriting');
        (window as any).web3 = new Web3(ethereum);
      }

      this.provider = ethereum;
    } else if ((window as any).web3) {
      log('has web3 injected.');
      // Legacy handling; will become unavailable 11/2.
      const { web3 } = window as any;
      if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
        throw new Error(
          'Web3 not found. Please check that MetaMask is installed',
        );
      }
      this.provider = web3.currentProvider;
    }
  }

  unlock(): Promise<FullWallet> {
    log('connecting using injectable wallet');
    return new Promise(async (resolve, reject) => {
      try {
        const accounts = await this.provider
          .send('eth_requestAccounts')
          .then((response: any) =>
            Array.isArray(response) ? response : response?.result || [],
          )
          .catch((err: any) => {
            if (err.code === 4001) {
              error('Connection rejected by user.');
            } else {
              error('Failed to connect', err);
            }
          });
        const chainId = await this.provider
          .send('eth_chainId')
          .then((response: any) => Number(response.result || response));
        resolve(
          new Web3Wallet(
            toChecksumAddress(accounts[0], chainId),
            chainId,
            this.provider,
          ),
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

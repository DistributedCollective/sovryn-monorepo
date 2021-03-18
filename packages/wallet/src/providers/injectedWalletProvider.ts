import Web3 from 'web3';
import debug from '../utils/debug';
import { Web3Wallet } from '../wallets/non-deterministic';
import { AbstractProvider } from './abstract-provider';
import { Wallet } from '../wallet';
import { FullWallet } from '../interfaces';
import PromiEvent from '../utils/promievent';

const { log, error } = debug('injected-wallet');

export class InjectedWalletProvider extends AbstractProvider {
  provider: any;
  wallet: Wallet;

  constructor(wallet: Wallet) {
    super(wallet);
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(): any {}

  unlock(): PromiEvent<FullWallet> {
    log('connecting using injectable wallet');
    return new PromiEvent(async resolve => {
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
      resolve(new Web3Wallet(accounts[0], chainId, this.provider));
    });
  }

  disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

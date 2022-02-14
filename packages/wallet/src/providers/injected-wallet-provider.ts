import Web3 from 'web3';
import { toChecksumAddress } from 'ethereumjs-util';
import { debug } from '@sovryn/common';
import { Web3Wallet } from '../wallets/non-deterministic';
import { WalletProviderInterface, FullWallet } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:injected-wallet');

export const getWeb3Provider = (name: 'ethereum' | 'eth' | 'rsk' | 'bsc') => {
  const ethereum = window[name];
  if (ethereum) {
    log('has ethereum injected.');
    if ((window as any).Web3) {
      log('has web3 injected, overwriting');
      (window as any).web3 = new Web3(ethereum);
    }

    return ethereum;
  } else if ((window as any).web3) {
    log('has web3 injected.');
    // Legacy handling; will become unavailable 11/2.
    const { web3 } = window as any;
    if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
      throw new Error(
        'Web3 not found. Please check that MetaMask is installed',
      );
    }
    return web3.currentProvider;
  }
};

export class InjectedWalletProvider implements WalletProviderInterface {
  provider: any;

  constructor() {
    log('constructing injected wallet provider.');
    this.provider = getWeb3Provider('ethereum');
  }

  static getProvider(requestedChainId?: number) {
    const _provider = getWeb3Provider('ethereum');
    if (_provider?.isLiquality) {
      switch(requestedChainId) {
        case 30:
        case 31:
          return getWeb3Provider('rsk');
        case 56:
        case 97:
          return getWeb3Provider('bsc');
        default:
          return _provider;
      }
    }
    return _provider;
  }

  unlock(requestedChainId: number): Promise<FullWallet> {
    log('connecting using injectable wallet', requestedChainId);
    return new Promise(async (resolve, reject) => {
      try {
        const accounts = await InjectedWalletProvider.getProvider(requestedChainId)
          .request({ method: 'eth_requestAccounts' })
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

        if (!accounts) {
          return reject(Error('Permission was not given.'));
        }

        const chainId = await InjectedWalletProvider.getProvider(requestedChainId)
          .request({ method: 'eth_chainId' })
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
}

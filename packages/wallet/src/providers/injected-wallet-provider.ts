import Web3 from 'web3';
import { toChecksumAddress } from 'ethereumjs-util';
import { debug } from '@sovryn/common';
import { Web3Wallet } from '../wallets/non-deterministic';
import { WalletProviderInterface, FullWallet } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:injected-wallet');

type LiqualityNetworks = 'ethereum' | 'eth' | 'rsk' | 'bsc' | 'polygon' | 'arbitrum' | 'fuse';

export const getWeb3Provider = (name: LiqualityNetworks) => {
  const ethereum = window[name];
  if (ethereum) {
    log('has ethereum injected.');
    if ((window as any).web3) {
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
  } else {
    return null;
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
        case 1:
        case 3:
          return getWeb3Provider('eth');
        case 30:
        case 31:
          return getWeb3Provider('rsk');
        case 56:
        case 97:
          return getWeb3Provider('bsc');
        case 122:
        case 123:
          return getWeb3Provider('fuse');
        case 137:
        case 80001:
          return getWeb3Provider('polygon');
        // case 200:
        case 42161:
        case 421611:
          return getWeb3Provider('arbitrum');
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

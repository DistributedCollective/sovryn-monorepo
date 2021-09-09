import { toChecksumAddress } from 'ethereumjs-util';
import { debug } from '@sovryn/common';
import { Web3Wallet } from '../wallets/non-deterministic';
import { WalletProviderInterface, FullWallet } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:software-wallet');

export class SoftwareWalletProvider implements WalletProviderInterface {
  provider: any;

  constructor() {
    log('constructing software wallet provider.');
  }

  unlock(): Promise<FullWallet> {
    log('connecting using injectable wallet');
    return new Promise(async (resolve, reject) => {
      try {
        const accounts = await this.provider
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

        const chainId = await this.provider
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

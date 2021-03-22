import { toChecksumAddress } from 'ethereumjs-util';
import Portis from '@portis/web3';
import Web3 from 'web3';
import debug from '../utils/debug';
import { PortisWallet } from '../wallets/non-deterministic';
import { FullWallet, WalletProviderInterface } from '../interfaces';

const { log, error } = debug('portis-wallet-provider');

const chainIdToNetwork = {
  1: 'mainnet',
  3: 'ropsten',
  30: 'orchid',
  31: 'orchidTestnet',
};

export class PortisWalletProvider implements WalletProviderInterface {
  provider: any;

  // @ts-ignore
  unlock(chainId: number): Promise<FullWallet> {
    log('connecting using injectable wallet');
    const portis = new Portis(
      '469a25c8-1101-4c57-823d-c47cb328f788',
      this.getNetwork(chainId),
    );
    this.provider = portis.provider;

    return new Promise(async (resolve, reject) => {
      try {
        const web3 = new Web3(this.provider);
        const accounts = await web3.eth.getAccounts();
        resolve(
          new PortisWallet(
            toChecksumAddress(accounts[0], chainId),
            chainId,
            portis,
          ),
        );
      } catch (e) {
        error('portis login errored', e);
        reject(e);
      }
    });
  }

  protected getNetwork(chainId: number) {
    if (chainIdToNetwork.hasOwnProperty(chainId)) {
      return chainIdToNetwork[chainId];
    }
    return 'orchid';
  }
}

import { toChecksumAddress } from 'ethereumjs-util';
import WCProvider from '@walletconnect/web3-provider';
// import Web3 from 'web3';
import debug from '../utils/debug';
import { WalletConnectWallet } from '../wallets/non-deterministic';
import { FullWallet, WalletProviderInterface } from '../interfaces';

const { log, error } = debug('wallet-connect-provider');

export class WalletConnectProvider implements WalletProviderInterface {
  provider: WCProvider;
  constructor() {
    log('initialized WalletConnect');
  }

  // @ts-ignore
  unlock(chainId: number): Promise<FullWallet> {
    return new Promise(async (resolve, reject) => {
      try {
        log('connecting using WalletConnect');
        this.provider = new WCProvider({
          infuraId: '8a669f27b05a457b880dfa89b536c220',
          chainId,
          // rpc: {
          //   30: 'https://public-node.rsk.co',
          //   31: 'https://public-node.testnet.rsk.co',
          // },
          qrcodeModalOptions: {
            mobileLinks: ['rwallet', 'metamask'],
          },
        });
        const accounts = await this.provider.enable();
        log(accounts);
        resolve(
          new WalletConnectWallet(
            toChecksumAddress(accounts[0], chainId),
            chainId,
            this.provider as any,
          ),
        );
      } catch (e) {
        error('WalletConnect login errored', e);
        this.provider.disconnect().catch();
        reject(e);
      }
    });
  }
}

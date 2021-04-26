import { toChecksumAddress } from 'ethereumjs-util';
import WCProvider from '@walletconnect/web3-provider';
import { debug } from '@sovryn/common';
import { WalletConnectWallet } from '../wallets/non-deterministic';
import { FullWallet, WalletProviderInterface } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:wallet-connect-provider');

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
          rpc: {
            30: 'https://public-node.rsk.co',
            31: 'https://public-node.testnet.rsk.co',
          },
          qrcodeModalOptions: {
            mobileLinks: ['defiant', 'rwallet'],
          },
        });
        const accounts = await this.provider.enable();
        log(accounts);
        resolve(
          new WalletConnectWallet(
            toChecksumAddress(accounts[0], this.provider.chainId),
            this.provider.chainId,
            this.provider as any,
          ),
        );
      } catch (e) {
        error('WalletConnect login errored', e);
        reject(e);
      }
    });
  }
}

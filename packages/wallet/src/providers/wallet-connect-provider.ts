import { toChecksumAddress } from 'ethereumjs-util';
import WCProvider from '@walletconnect/web3-provider';
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
  unlock(chainId: number, onConnect: (w: FullWallet) => void): Promise<string> {
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
          qrcode: false,
        });
        const wc = this.provider.wc;
        const sessionRequestOpions = { chainId };

        await wc.createSession(sessionRequestOpions);

        log('WC URI: ', wc.uri);

        wc.on('connect', (err, payload) => {
          if (err) return err;
          const { params } = payload;
          const { chainId, accounts } = params[0];
          const wallet = new WalletConnectWallet(
            toChecksumAddress(accounts[0], chainId),
            chainId,
            this.provider as any,
          );

          wc.on('disconnect', err => {
            log('disconnect wallet connect');
            if (err) return;
            wallet.disconnect();
          });

          onConnect(wallet);
        });

        resolve(wc.uri);
      } catch (e) {
        error('WalletConnect login errored', e);
        reject(e);
      }
    });
  }
}

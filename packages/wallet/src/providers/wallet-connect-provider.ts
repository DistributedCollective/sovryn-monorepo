import { toChecksumAddress } from 'ethereumjs-util';
import WCProvider from '@walletconnect/web3-provider';
import { debug } from '@sovryn/common';
import { WalletConnectWallet } from '../wallets/non-deterministic';
import { FullWallet, WalletProviderInterface } from '../interfaces';
import type { WalletService } from '../wallet.service';

const { log, error } = debug('@sovryn/wallet:wallet-connect-provider');

export class WalletConnectProvider implements WalletProviderInterface {
  provider: WCProvider;
  constructor(private readonly service: WalletService) {
    log('initialized WalletConnect', service);
  }

  unlock(chainId: number, uriCallback: (uri: string) => void): Promise<FullWallet> {
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

        if (!wc.connected) {
          await wc.createSession(sessionRequestOpions);
        }

        log('WC URI: ', wc.uri);
        let wallet;

        uriCallback(wc.uri);

        wc.on('connect', (err, payload) => {
          if (err) return err;
          const { params } = payload;
          const { chainId, accounts } = params[0];
          wallet = new WalletConnectWallet(
            toChecksumAddress(accounts[0], chainId),
            chainId,
            this.provider as any,
          );
          resolve(wallet);
        });

        wc.on('disconnect', () => {
          log('disconnect event received', wallet);
          this.service.disconnect();
        });

        wc.on('session_update', () => {
          log('session updated.');
        });

      } catch (e) {
        error('WalletConnect login errored', e);
        reject(e);
      }
    });
  }
}

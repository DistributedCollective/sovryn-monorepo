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

  unlock(
    chainId: number,
    uriCallback: (uri: string) => void,
  ): Promise<FullWallet> {
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

        this.provider.connector.on('display_uri', (err, payload) => {
          if (!err) {
            uriCallback(payload.params[0]);
          } else {
            reject(err);
          }
        });

        this.provider.connector.on('disconnect', () => {
          if (this.service.wallet) {
            try {
              this.service.disconnect();
            } catch (e) {
              error(e);
            }
          }
        });

        const accounts = await this.provider.enable();

        if (accounts.length !== 0) {
          resolve(
            new WalletConnectWallet(
              toChecksumAddress(accounts[0], this.provider.chainId),
              this.provider.chainId,
              this.provider as any,
            ),
          );
        } else {
          reject(Error('no accounts found'));
        }
      } catch (e) {
        error('WalletConnect login errored', e);
        reject(e);
      }
    });
  }
}

import { toChecksumAddress } from 'ethereumjs-util';
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { debug } from '@sovryn/common';
import { WalletConnectWallet } from '../wallets/non-deterministic';
import { FullWallet, WalletProviderInterface } from '../interfaces';
import type { WalletService } from '../wallet.service';

const { log, error } = debug('@sovryn/wallet:wallet-connect-provider');

export class WalletConnectProvider implements WalletProviderInterface {
  provider: any;
  constructor(private readonly service: WalletService) {
    log('initialized WalletConnect', service);
  }

  async unlock(
    chainId: number,
    uriCallback: (uri: string) => void,
  ): Promise<FullWallet> {
    return new Promise(async (resolve, reject) => {
      try {
        log('connecting using WalletConnect');
        const provider = await EthereumProvider.init({
          // sovryn alpha prject id
          projectId: '06a5d05ec3c71f029fac7b239406f3f1',
          chains: [1, 30, 56],
          optionalChains: [11155111, 31, 97],
          optionalMethods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'personal_sign',
            'eth_sign',
            'eth_signTypedData',
            'eth_signTypedData_v4',
          ],
          rpcMap: {
            1: 'https://ethereum.publicnode.com',
            11155111: 'https://rpc2.sepolia.org',
            30: 'https://public-node.rsk.co',
            31: 'https://public-node.testnet.rsk.co',
            56: 'https://bsc.publicnode.com',
            97: 'https://bsc-testnet.publicnode.com',
          },
          showQrModal: false,
        });

        provider.on('display_uri', (uri: string) => {
          uriCallback(uri);
        });

        provider.on('disconnect', () => {
          if (this.service.wallet) {
            try {
              this.service.disconnect();
            } catch (e) {
              error(e);
            }
          }
        });

        this.provider = provider;

        await provider.connect({
          chains: [chainId],
        });

        const accounts = await provider.enable();

        if (accounts.length !== 0) {
          resolve(
            // @ts-ignore
            new WalletConnectWallet(
              toChecksumAddress(accounts[0], chainId),
              chainId,
              provider as any,
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

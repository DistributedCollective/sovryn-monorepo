import Trezor from 'trezor-connect';
import { debug } from '@sovryn/common';
import { ChainCodeResponse, TrezorWallet } from '../wallets';
import { WalletProviderInterface } from '../interfaces';

const { log, error } = debug('@sovryn/wallet:trezor-provider');

export function makeTrezorManifest() {
  Trezor.manifest({
    email: 'victor@sovryn.app',
    appUrl: 'https://www.sovryn.app',
  });
}

export class TrezorWalletProvider implements WalletProviderInterface {
  constructor() {
    makeTrezorManifest();
    log('init');
  }

  public static async getChainCode(dPath: string): Promise<ChainCodeResponse> {
    const result = await Trezor.ethereumGetPublicKey({ path: dPath });
    if (!result.payload) {
      error('Failed to open trezor popup.');
      throw new Error('popup failed to open');
    }
    if (!result.success) throw new Error(result.payload.error);
    return {
      publicKey: result.payload.publicKey,
      chainCode: result.payload.chainCode,
    };
  }

  // @ts-ignore
  async unlock(
    dPath: string,
    address: string,
    index: number,
  ): Promise<TrezorWallet> {
    return new TrezorWallet(address, dPath, index);
  }
}

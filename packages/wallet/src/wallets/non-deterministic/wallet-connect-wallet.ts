import { bufferToHex } from 'ethereumjs-util';
import { RawTransactionData } from './../../interfaces/wallet.interface';
import { ProviderType } from '../../constants';
import { Web3Wallet } from './web3';

export class WalletConnectWallet extends Web3Wallet {
  //add constructor
  //disconnect if the user is is out
  public getWalletType(): string {
    return ProviderType.WALLET_CONNECT;
  }

  public disconnect(): Promise<boolean> {
    if (!this.provider) {
      return Promise.resolve(true);
    }
    return (this.provider as any)
      .disconnect()
      .then(() => true)
      .catch(() => false);
  }

  public async sendTransaction(tx: RawTransactionData) {
    if (!this.provider) {
      return Promise.reject('provider is not availble');
    }
    //@ts-ignore
    return await this.provider.wc.sendTransaction(
      this.prepareRawTransactionData(tx),
    );
  }

  public async signMessage(msg: string): Promise<string> {
    if (!this.provider) {
      return Promise.reject('provider is not availble');
    }
    const msgHex = bufferToHex(Buffer.from(msg));
    //@ts-ignore
    return await this.provider.wc.signPersonalMessage([
      this.address.toLowerCase(),
      msgHex,
    ]);
  }
}

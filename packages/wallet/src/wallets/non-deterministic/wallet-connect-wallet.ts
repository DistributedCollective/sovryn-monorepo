import { ProviderType } from '../../constants';
import { Web3Wallet } from './web3';

export class WalletConnectWallet extends Web3Wallet {
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
}

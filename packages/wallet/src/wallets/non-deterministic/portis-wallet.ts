import { ProviderType } from '../../constants';
import { Web3Wallet } from './web3';

export class PortisWallet extends Web3Wallet {
  public getWalletType(): string {
    return ProviderType.PORTIS;
  }
}

import type Portis from '@portis/web3';
import type { provider } from 'web3-core';
import { ProviderType } from '../../constants';
import { Web3Wallet } from './web3';

export class PortisWallet extends Web3Wallet {
  readonly _provider: provider;
  readonly portis: Portis;

  constructor(address: string, chainId: number, portis: Portis) {
    super(address, chainId, portis.provider);
    this.portis = portis;
  }

  public getWalletType(): string {
    return ProviderType.PORTIS;
  }

  public disconnect(): Promise<boolean> {
    // @ts-ignore
    return this.portis.logout();
  }
}

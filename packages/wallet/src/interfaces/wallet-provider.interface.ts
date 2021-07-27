import { FullWallet } from './wallet.interface';

export interface WalletProviderInterface {
  unlock(...args: any[]): Promise<FullWallet>;
}

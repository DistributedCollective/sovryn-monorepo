import { FullWallet } from './wallet.interface';

export interface WalletProviderInterface {
  unlock(address: string): Promise<FullWallet>;
}

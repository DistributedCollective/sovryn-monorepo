import { WalletType } from './wallet.interface';
import { Wallet } from '../wallet';
import PromiEvent from '../utils/promievent';

export interface WalletProviderInterface {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (wallet: Wallet): WalletProviderInterface;
  init(): any;
  unlock(): PromiEvent<WalletType>;
  disconnect(): Promise<boolean>;
}

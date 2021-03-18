import { WalletType } from './wallet.interface';
import { Wallet } from '../wallet';
import PromiEvent from '../utils/promievent';
export interface WalletProviderInterface {
    new (wallet: Wallet): WalletProviderInterface;
    init(): any;
    unlock(): PromiEvent<WalletType>;
    disconnect(): Promise<boolean>;
}

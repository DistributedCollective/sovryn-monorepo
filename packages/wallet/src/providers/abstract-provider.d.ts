import { WalletProviderInterface, WalletType } from '../interfaces';
import { Wallet } from '../wallet';
import PromiEvent from '../utils/promievent';
export declare abstract class AbstractProvider implements WalletProviderInterface {
    protected _wallet: Wallet;
    protected constructor(wallet: Wallet);
    abstract init(): any;
    abstract unlock(): PromiEvent<WalletType>;
    abstract disconnect(): Promise<boolean>;
}

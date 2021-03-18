import { WalletProviderInterface, WalletType } from '../interfaces';
import { Wallet } from '../wallet';
import PromiEvent from '../utils/promievent';

// @ts-ignore
export abstract class AbstractProvider implements WalletProviderInterface {
  protected _wallet: Wallet;
  protected constructor(wallet: Wallet) {
    this._wallet = wallet;
  }

  abstract init(): any;
  abstract unlock(): PromiEvent<WalletType>;
  abstract disconnect(): Promise<boolean>;
}

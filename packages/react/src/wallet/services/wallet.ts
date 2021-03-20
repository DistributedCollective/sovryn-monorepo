import type { Wallet } from '@sovryn/wallet';

class WalletSingleton {
  protected wallet: Wallet;
  public set(wallet: Wallet) {
    this.wallet = wallet;
  }

  public get() {
    return this.wallet;
  }
}
export const walletInstance = new WalletSingleton();
export const getWallet = () => walletInstance.get();
export const setWallet = (wallet: Wallet) => walletInstance.set(wallet);

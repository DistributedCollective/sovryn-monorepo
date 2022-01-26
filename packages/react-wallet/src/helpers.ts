import { ProviderType } from "@sovryn/wallet";
import { WALLETS_SUPPORTS_TYPED_SIGNATURES } from "./contants";

export const isWalletVisibleForSignTyped = (wallet: ProviderType, requireSignTyped: boolean = false) => {
  if (!requireSignTyped) {
    return true;
  }
  return WALLETS_SUPPORTS_TYPED_SIGNATURES.includes(wallet);
}

export const isAnyWalletVisibleForSignTyped = (wallets: ProviderType[], requireSignTyped: boolean = false) => {
  if (!requireSignTyped) {
    return true;
  }
  return wallets.some(item => WALLETS_SUPPORTS_TYPED_SIGNATURES.includes(item));
}

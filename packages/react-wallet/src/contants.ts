import { ProviderType } from "@sovryn/wallet";

// actually supports more networks, but we dont support all we are not including them.
export const PORTIS_SUPPORTED_CHAINS = [1, 3, 4, 18, 30, 31];

// signTyped availability, required for meta transactions
export const WALLETS_SUPPORTS_TYPED_SIGNATURES = [ProviderType.WEB3, ProviderType.WALLET_CONNECT];


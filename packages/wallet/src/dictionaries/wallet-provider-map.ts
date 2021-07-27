import { ProviderType } from '../constants';
import {
  InjectedWalletProvider,
  LedgerWalletProvider,
  PortisWalletProvider,
  TrezorWalletProvider,
  WalletConnectProvider,
} from '../providers';
import {
  LedgerWallet,
  TrezorWallet,
  PortisWallet,
  WalletConnectWallet,
  Web3Wallet,
} from '../wallets';

export const walletProviderMap = {
  [ProviderType.WEB3]: InjectedWalletProvider,
  [ProviderType.LEDGER]: LedgerWalletProvider,
  [ProviderType.TREZOR]: TrezorWalletProvider,
  [ProviderType.PORTIS]: PortisWalletProvider,
  [ProviderType.WALLET_CONNECT]: WalletConnectProvider,
};

export const hardwareWallets = [ProviderType.LEDGER, ProviderType.TREZOR];
export const web3Wallets = [
  ProviderType.WEB3,
  ProviderType.PORTIS,
  ProviderType.WALLET_CONNECT,
];

export function isHardwareWallet(
  x: ProviderType,
): x is ProviderType.LEDGER | ProviderType.TREZOR {
  return hardwareWallets.includes(x);
}

export function isWeb3Wallet(
  x: ProviderType,
): x is ProviderType.WEB3 | ProviderType.PORTIS | ProviderType.WALLET_CONNECT {
  return web3Wallets.includes(x);
}

export const providerToWalletMap = {
  [ProviderType.WEB3]: Web3Wallet,
  [ProviderType.LEDGER]: LedgerWallet,
  [ProviderType.TREZOR]: TrezorWallet,
  [ProviderType.PORTIS]: PortisWallet,
  [ProviderType.WALLET_CONNECT]: WalletConnectWallet,
};

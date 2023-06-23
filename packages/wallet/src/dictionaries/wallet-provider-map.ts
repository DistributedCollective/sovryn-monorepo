import { ProviderType } from '../constants';
import {
  InjectedWalletProvider,
  LedgerWalletProvider,
  PortisWalletProvider,
  TrezorWalletProvider,
} from '../providers';
import {
  LedgerWallet,
  PortisWallet,
  TrezorWallet,
  Web3Wallet,
} from '../wallets';
import { SoftwareWalletProvider } from '../providers/software-wallet-provider';
import { SoftwareWallet } from '../wallets/software-wallet';

export const walletProviderMap = {
  [ProviderType.WEB3]: InjectedWalletProvider,
  [ProviderType.LEDGER]: LedgerWalletProvider,
  [ProviderType.TREZOR]: TrezorWalletProvider,
  [ProviderType.PORTIS]: PortisWalletProvider,
  [ProviderType.SOFTWARE_ENTROPY]: SoftwareWalletProvider,
  [ProviderType.SOFTWARE_PK]: SoftwareWalletProvider,
};

export const hardwareWallets = [ProviderType.LEDGER, ProviderType.TREZOR];
export const web3Wallets = [
  ProviderType.WEB3,
  ProviderType.PORTIS,
];
export const softwareWallets = [ProviderType.SOFTWARE_ENTROPY, ProviderType.SOFTWARE_PK];

export function isHardwareWallet(
  x: ProviderType,
): x is ProviderType.LEDGER | ProviderType.TREZOR {
  return hardwareWallets.includes(x);
}

export function isWeb3Wallet(
  x: ProviderType,
): x is ProviderType.WEB3 | ProviderType.PORTIS {
  return web3Wallets.includes(x);
}

export function isSoftwareWallet(
  x: ProviderType,
): x is ProviderType.SOFTWARE_ENTROPY | ProviderType.SOFTWARE_PK {
  return softwareWallets.includes(x);
}

export const providerToWalletMap = {
  [ProviderType.WEB3]: Web3Wallet,
  [ProviderType.LEDGER]: LedgerWallet,
  [ProviderType.TREZOR]: TrezorWallet,
  [ProviderType.PORTIS]: PortisWallet,
  [ProviderType.SOFTWARE_ENTROPY]: SoftwareWallet,
  [ProviderType.SOFTWARE_PK]: SoftwareWallet,
};

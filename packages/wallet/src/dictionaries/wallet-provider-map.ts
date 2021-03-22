import { ProviderType } from '../constants';
import {
  InjectedWalletProvider,
  LedgerWalletProvider,
  PortisWalletProvider,
  TrezorWalletProvider,
} from '../providers';
import { Web3Wallet } from '../wallets/non-deterministic';
import { LedgerWallet, TrezorWallet, PortisWallet } from '../wallets';

export const walletProviderMap = {
  [ProviderType.WEB3]: InjectedWalletProvider,
  [ProviderType.LEDGER]: LedgerWalletProvider,
  [ProviderType.TREZOR]: TrezorWalletProvider,
  [ProviderType.PORTIS]: PortisWalletProvider,
};

export const hardwareWallets = [ProviderType.LEDGER, ProviderType.TREZOR];
export const web3Wallets = [ProviderType.WEB3, ProviderType.PORTIS];

export const providerToWalletMap = {
  [ProviderType.WEB3]: Web3Wallet,
  [ProviderType.LEDGER]: LedgerWallet,
  [ProviderType.TREZOR]: TrezorWallet,
  [ProviderType.PORTIS]: PortisWallet,
};

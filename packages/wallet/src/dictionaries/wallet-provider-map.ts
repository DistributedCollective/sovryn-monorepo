import { ProviderType } from '../constants';
import {
  InjectedWalletProvider,
  LedgerWalletProvider,
  TrezorWalletProvider,
} from '../providers';
import { Web3Wallet } from '../wallets/non-deterministic';
import { LedgerWallet, TrezorWallet } from '../wallets';

export const walletProviderMap = {
  [ProviderType.WEB3]: InjectedWalletProvider,
  [ProviderType.LEDGER]: LedgerWalletProvider,
  [ProviderType.TREZOR]: TrezorWalletProvider,
};

export const hardwareWallets = [ProviderType.LEDGER, ProviderType.TREZOR];

export const providerToWalletMap = {
  [ProviderType.WEB3]: Web3Wallet,
  [ProviderType.LEDGER]: LedgerWallet,
  [ProviderType.TREZOR]: TrezorWallet,
};

interface DPath {
  value: string;
  label: string;
  chainId: number;
}

export const dPathMap: DPath[] = [
  { value: "m/44'/60'", label: 'Ledger Live', chainId: 1 },
  { value: "m/44'/60'/0'", label: 'MyEtherWallet', chainId: 1 },
  { value: "m/44'/137'/0'/0", label: 'RSK Mainnet', chainId: 30 },
  // { value: "m/44'/137'/0'/0", label: 'RSK Testnet', chainId: 31 }, // real testnet path is "m/44'/37310'/0'/0" but it's currently not supported by rsk app on ledger
  { value: "44'/0'/0'/0/0", label: 'BTC', chainId: 31 },
];

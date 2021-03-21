export interface DPath {
  label: string;
  path: string;
}

export const ethereum: DPath = {
  path: "m/44'/60'/0'/0",
  label: 'Ethereum',
};

export const ropsten: DPath = {
  path: "m/44'/1'/0'/0",
  label: 'Ropsten Testnet',
};

export const ledgerEthereum: DPath = {
  path: "m/44'/60'/0'",
  label: 'Ethereum',
};

export const ledgerLiveEthereum: DPath = {
  path: "m/44'/60'",
  label: 'Ethereum - Ledger Live',
};

export const rskMainnet: DPath = {
  path: "m/44'/137'/0'/0",
  label: 'RSK Mainnet',
};

export const rskTestnet: DPath = {
  path: "m/44'/37310'/0'/0",
  label: 'RSK Testnet',
};

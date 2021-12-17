export interface DPath {
  label: string;
  path: string;
  network: string;
}

export const ethereum: DPath = {
  path: "m/44'/60'/0'/0",
  label: 'Ethereum',
  network: 'eth',
};

export const ropsten: DPath = {
  path: "m/44'/1'/0'/0",
  label: 'Ropsten Testnet',
  network: 'eth',
};

export const ledgerEthereum: DPath = {
  path: "m/44'/60'/0'",
  label: 'Ethereum - Ledger',
  network: 'eth',
};

export const ledgerLiveEthereum: DPath = {
  path: "m/44'/60'",
  label: 'Ethereum - Ledger Live',
  network: 'eth',
};

export const ledgerEthereumLegacy: DPath = {
  path: "m/44'/60'/0'/0",
  label: 'Ethereum',
  network: 'eth',
};

export const rskMainnet: DPath = {
  path: "m/44'/137'/0'/0",
  label: 'RSK Mainnet',
  network: 'rsk',
};

export const rskTestnet: DPath = {
  path: "m/44'/37310'/0'/0",
  label: 'RSK Testnet',
  network: 'rsk',
};

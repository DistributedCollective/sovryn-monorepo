import Web3 from 'web3';
import { walletService } from './wallet';
import type { HttpProvider, WebsocketProvider } from 'web3-core';

export class Node {
  public readonly nodes: Map<number, Web3> = new Map<number, Web3>();

  public async getBalance(chainId: number, address: string) {
    const node = this.get(chainId);

    if (!node) {
      console.error('no node', node, chainId);
      return '0';
    }

    try {
      return node.eth.getBalance(address.toLowerCase()).then(balance => {
        console.log('balance', address, balance);
        return balance;
      });
    } catch (e) {
      console.error('crashed');
      return '0';
    }
  }

  public get(chainId: number) {
    if (!this.nodes.has(chainId)) {
      const network = walletService.networkDictionary.get(chainId);
      console.log('network', network?.getName(), network?.getNodeUrl());
      console.log(network);

      if (network && network.getNodeUrl()) {
        let provider: HttpProvider | WebsocketProvider;
        if (network.getNodeUrl().startsWith('http')) {
          provider = new Web3.providers.HttpProvider(network.getNodeUrl());
        } else {
          provider = new Web3.providers.WebsocketProvider(network.getNodeUrl());
        }
        const web3 = new Web3(provider);
        this.nodes.set(chainId, web3);
      }
    }

    console.log('nodes', this.nodes);

    return this.nodes.get(chainId);
  }
}

export const nodeService = new Node();

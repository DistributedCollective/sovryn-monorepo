import { useContext } from 'react';
import { WalletContext } from '../contexts';

/**
 * @deprecated use useContext(WalletContext) instead
 */
export const useWalletContext = () => useContext(WalletContext);

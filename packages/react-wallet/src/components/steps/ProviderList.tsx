import * as React from 'react';
import { ProviderType } from '@sovryn/wallet';
import { Dialog } from '../Dialog';
import styles from './provider-list.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProvider: (provider: ProviderType) => void;
  loading?: boolean;
}

// @ts-ignore
const hasWeb3Wallet = window?.ethereum || window?.web3;

export function ProviderList(props: Props) {
  const [provider, setProvider] = React.useState<ProviderType>('' as any);

  return (
    <Dialog onClose={props.onClose} isOpen={props.isOpen}>
      <h1>Select your provider:</h1>

      <label className={styles.provider}>
        <input
          name='provider'
          value={ProviderType.WEB3}
          type='radio'
          disabled={!hasWeb3Wallet}
          onChange={e => setProvider(e.currentTarget.value as any)}
        />
        <div className={styles.provider__value}>
          <div>Web3</div>
          <div className={styles.provider__download}>
            Download{' '}
            <a
              href='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Nifty
            </a>
            ,{' '}
            <a
              href='https://liquality.io/atomic-swap-wallet.html'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Liquality
            </a>{' '}
            or{' '}
            <a
              href='https://metamask.io/download.html'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Metamask
            </a>
            .
          </div>
        </div>
      </label>

      <label className={styles.provider}>
        <input
          name='provider'
          value={ProviderType.LEDGER}
          type='radio'
          onChange={e => setProvider(e.currentTarget.value as any)}
        />
        <div className={styles.provider__value}>
          <div>Ledger</div>
          <div className={styles.provider__download}>
            <a
              href='https://shop.ledger.com/?r=3035eca29af2'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Buy Now
            </a>
          </div>
        </div>
      </label>

      <label className={styles.provider}>
        <input
          name='provider'
          value={ProviderType.TREZOR}
          type='radio'
          onChange={e => setProvider(e.currentTarget.value as any)}
        />
        <div className={styles.provider__value}>
          <div>Trezor</div>
          <div className={styles.provider__download}>
            <a href='#' target='_blank' rel='noreferrer nofollow'>
              Buy Now
            </a>
          </div>
        </div>
      </label>

      <label className={styles.provider}>
        <input
          name='provider'
          value={ProviderType.PORTIS}
          type='radio'
          onChange={e => setProvider(e.currentTarget.value as any)}
        />
        <div className={styles.provider__value}>
          <div>Portis</div>
          <div className={styles.provider__download}>
            <a
              href='https://www.portis.io/'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Learn more
            </a>
          </div>
        </div>
      </label>

      <label className={styles.provider}>
        <input
          name='provider'
          value={ProviderType.WALLET_CONNECT}
          type='radio'
          onChange={e => setProvider(e.currentTarget.value as any)}
        />
        <div className={styles.provider__value}>
          <div>Wallet Connect</div>
          <div className={styles.provider__download}>
            <a
              href='https://walletconnect.org/'
              target='_blank'
              rel='noreferrer nofollow'
            >
              Learn more
            </a>
          </div>
        </div>
      </label>

      <button
        type='button'
        disabled={!provider || props.loading}
        onClick={() => props.onProvider(provider)}
      >
        Continue
      </button>
    </Dialog>
  );
}

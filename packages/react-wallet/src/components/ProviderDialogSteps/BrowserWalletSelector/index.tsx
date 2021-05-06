import { ProviderType } from '@sovryn/wallet';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { images } from '../../../assets/images';
import { translations } from '../../../locales/i18n';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { Item, ItemLink } from '../../Item';
import { ItemList } from '../../ItemList';

interface Props {
  onWalletSelected: (value: ProviderType) => void;
}

const wallet = detectInjectableWallet();

export function BrowserWalletSelector(props: Props) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t(translations.dialogs.browserSelector.title)}:</h1>
      <P>
      {t(translations.dialogs.browserSelector.disable)}
      </P>
      <ItemList>
        {wallet !== 'liquality' && (
          <ItemLink
            image={images.liqualityWallet}
            title='Liquality'
            href='https://liquality.io/atomic-swap-wallet.html'
            linkHref='https://liquality.io/atomic-swap-wallet.html'
            linkTitle={t(translations.dialogs.browserSelector.download)}
          />
        )}
        {wallet === 'liquality' && (
          <Item
            image={images.liqualityWallet}
            title='Liquality'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://liquality.io/atomic-swap-wallet.html'
            linkTitle={t(translations.dialogs.browserSelector.download)}
          />
        )}
        {wallet === 'nifty' && (
          <Item
            image={images.niftyWallet}
            title='Nifty'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid'
            linkTitle={t(translations.dialogs.browserSelector.download)}
          />
        )}
        {['metamask', 'unknown'].includes(wallet) && (
          <Item
            image={images.metamaskWallet}
            title='MetaMask'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://metamask.io/download.html'
            linkTitle={t(translations.dialogs.browserSelector.download)}
          />
        )}
        <Item
          image={images.portisWallet}
          title='Portis'
          onClick={() => props.onWalletSelected(ProviderType.PORTIS)}
          linkHref='https://www.portis.io'
          linkTitle={t(translations.dialogs.browserSelector.learn)}
          />
      </ItemList>
      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t(translations.dialogs.providerTypes.instructions)}
        </a>
      </BottomLinkContainer>
    </div>
  );
}

function detectInjectableWallet() {
  const { ethereum } = window as any;
  if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false;
    if (ethereum.isLiquality) return 'liquality';
    if (ethereum.isNiftyWallet) return 'nifty';
    if (ethereum.isMetaMask) return 'metamask';
    return 'unknown';
  }
  return 'none';
}

const P = styled.p`
  margin: 0 auto;
  text-align: center;
`;

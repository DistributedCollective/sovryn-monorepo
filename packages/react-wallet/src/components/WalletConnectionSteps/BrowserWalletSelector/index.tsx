import { ProviderType } from '@sovryn/wallet';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { WalletContext } from '../../..';

import { images } from '../../../assets/images';
import { PORTIS_SUPPORTED_CHAINS } from '../../../contants';
import { translations } from '../../../locales/i18n';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { Item, ItemLink } from '../../Item';
import { ItemList } from '../../ItemList';

interface Props {
  onWalletSelected: (value: ProviderType) => void;
  hideInstructionLink?: boolean;
}

const wallet = detectInjectableWallet();

export function BrowserWalletSelector(props: Props) {
  const { t } = useTranslation();
  const { expectedChainId, signTypedRequired, options } = React.useContext(
    WalletContext,
  );

  return (
    <div>
      <h1>{t(translations.dialogs.browserSelector.title)}:</h1>
      <P>{t(translations.dialogs.browserSelector.disable)}</P>
      <ItemList>
        {!signTypedRequired && (
          <React.Fragment>
            {wallet !== 'liquality' && (
              <ItemLink
                options={options}
                image={images.liqualityWallet}
                title='Liquality'
                href='https://liquality.io/'
                linkHref='https://liquality.io/'
                linkTitle={t(translations.dialogs.browserSelector.download)}
                dataAttribute='browserType-liquality-download'
              />
            )}
            {wallet === 'liquality' && (
              <Item
                options={options}
                image={images.liqualityWallet}
                title='Liquality'
                onClick={() => props.onWalletSelected(ProviderType.WEB3)}
                linkHref='https://liquality.io/'
                linkTitle={t(translations.dialogs.browserSelector.download)}
                dataAttribute='browserType-liquality'
              />
            )}
          </React.Fragment>
        )}

        {wallet === 'nifty' && (
          <Item
            options={options}
            image={images.injectedWeb3Wallet}
            title='Injected Web'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://wiki.sovryn.app/en/getting-started/nifty-wallet-discontinuation'
            linkTitle={t(translations.dialogs.browserSelector.learn)}
            dataAttribute='browserType-nifty'
          />
        )}
        {(['metamask', 'unknown'].includes(wallet) ||
          (signTypedRequired && wallet === 'liquality')) && (
          <Item
            options={options}
            image={images.metamaskWallet}
            title='MetaMask'
            onClick={() => props.onWalletSelected(ProviderType.WEB3)}
            linkHref='https://metamask.io/download.html'
            linkTitle={t(translations.dialogs.browserSelector.download)}
            dataAttribute='browserType-metamask'
          />
        )}
        {PORTIS_SUPPORTED_CHAINS.includes(expectedChainId!) && (
          <Item
            options={options}
            image={images.portisWallet}
            title='Portis'
            onClick={() => props.onWalletSelected(ProviderType.PORTIS)}
            linkHref='https://www.portis.io'
            linkTitle={t(translations.dialogs.browserSelector.learn)}
            dataAttribute='browserType-portis'
          />
        )}
      </ItemList>
      {!props.hideInstructionLink && (
        <BottomLinkContainer>
          <a
            href='https://wiki.sovryn.app'
            target='_blank'
            rel='noreferrer noopener'
            data-action-id='walletDialog-link-how-to-connect'
          >
            {t(translations.dialogs.providerTypes.instructions)}
          </a>
        </BottomLinkContainer>
      )}
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

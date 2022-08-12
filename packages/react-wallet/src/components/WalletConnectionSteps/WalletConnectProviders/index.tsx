import React, { useEffect } from 'react';
import { ProviderType } from '@sovryn/wallet';
import styled from 'styled-components/macro';
import { WalletItem } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { WalletOptions } from '../../../contexts';
interface Props {
  onWalletSelected: (value: ProviderType) => void;
  uri?: string;
  options?: WalletOptions;
  hideInstructionLink?: boolean;
}

export function WalletConnectProviders(props: Props) {
  const { t } = useTranslation();
  useEffect(() => {
    props.onWalletSelected(ProviderType.WALLET_CONNECT);
  }, []);
  return (
    <div>
      <h1>{t(translations.dialogs.walletConnect.title)}</h1>
      <Container>
        <LeftContainer>
          <p>{t(translations.dialogs.walletConnect.wallet)}</p>
          <WalletButtons>
            <WalletItem
              options={props.options}
              image={images.dcentWallet}
              title='D’cent'
              small={true}
              android={props.uri}
              universal='https://dcentwallet.com/MobileApp'
              dataAttribute='mobileWallet-dcent'
            />
            <WalletItem
              options={props.options}
              image={images.mathWallet}
              title='Math'
              small={true}
              android={props.uri}
              universal='https://mathwallet.org/en-us/'
              dataAttribute='mobileWallet-math'
            />
            <WalletItem
              options={props.options}
              image={images.defiantWallet}
              title='defiant'
              small={true}
              ios={`defiantapp://wc?uri=${props.uri}`}
              android={props.uri}
              universal='https://defiantapp.tech/'
              dataAttribute='mobileWallet-defiant'
            />
          </WalletButtons>
        </LeftContainer>

        <QRWrapper data-action-id='link-how-to-connect'>
          {props.uri && (
            <QRCode
              value={props.uri || ''}
              size={props.options?.size === 'sm' ? 200 : 300}
              renderAs='svg'
              includeMargin
            />
          )}
        </QRWrapper>
      </Container>

      {!props.hideInstructionLink && (
        <BottomLinkContainer>
          <a
            href='https://wiki.sovryn.app'
            target='_blank'
            rel='noreferrer noopener'
            data-action-id='walletDialog-link-how-to-connect'
          >
            {t(translations.dialogs.providerTypes.instructionsMobile)}
          </a>
        </BottomLinkContainer>
      )}
    </div>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 35px;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const QRWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
  margin: 10px;
`;
const WalletButtons = styled.div`
  display: flex;
  align-items: center;
`;

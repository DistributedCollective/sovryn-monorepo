import React, { useEffect } from 'react';
import { ProviderType } from '@sovryn/wallet';
import styled from 'styled-components/macro';
import { WalletItem } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
interface Props {
  onWalletSelected: (value: ProviderType) => void;
  uri?: string;
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
              image={images.rWallet}
              title='rwallet'
              small={true}
              ios={`rwallet://wc?uri=${props.uri}`}
              android={props.uri}
              universal='https://developers.rsk.co/wallet/rwallet/'
            />
            <WalletItem
              image={images.defiantWallet}
              title='defiant'
              small={true}
              ios={`defiantapp://wc?uri=${props.uri}`}
              android={props.uri}
              universal='https://defiantapp.tech/'
            />
          </WalletButtons>
        </LeftContainer>

        <QRWrapper>
          {props.uri && (
            <QRCode
              value={props.uri || ''}
              size={300}
              renderAs='svg'
              includeMargin
            />
          )}
        </QRWrapper>
      </Container>

      <BottomLinkContainer>
        <a
          href='https://wiki.sovryn.app'
          target='_blank'
          rel='noreferrer noopener'
        >
          {t(translations.dialogs.providerTypes.instructionsMobile)}
        </a>
      </BottomLinkContainer>
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

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { WalletConnectionStep } from '../../WalletConnectionView/types';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { translations } from '../../../locales/i18n';
import { isAnyWalletVisibleForSignTyped, isWalletVisibleForSignTyped } from '../../../helpers';
import { ProviderType } from '@sovryn/wallet';
import { WalletContext } from '../../..';
import { WALLET_CONNECT_SUPPORTED_CHAINS } from '../../../contants';

interface Props {
  onStep: (value: WalletConnectionStep) => void;
  hideInstructionLink?: boolean;
  enableSoftwareWallet?: boolean;
}

export function ProviderTypeSelector(props: Props) {
  const { t } = useTranslation();
  const { signTypedRequired, expectedChainId } = React.useContext(WalletContext);
  return (
    <div>
      <h1>{t(translations.dialogs.providerTypes.title)}</h1>
      <ItemList>
        {isAnyWalletVisibleForSignTyped([ProviderType.LEDGER, ProviderType.TREZOR], signTypedRequired) && (
          <Item
            image={images.hardwareWallets}
            title={t(translations.dialogs.providerTypes.items.hardware)}
            onClick={() => props.onStep(WalletConnectionStep.HARDWARE_PROVIDERS)}
            dataAttribute="walletType-hardware"
          />
        )}
        {(isWalletVisibleForSignTyped(ProviderType.WALLET_CONNECT, signTypedRequired) && WALLET_CONNECT_SUPPORTED_CHAINS.includes(expectedChainId!)) && (
          <Item
            image={images.mobileWallets}
            title={t(translations.dialogs.providerTypes.items.mobile)}
            onClick={() =>
              props.onStep(WalletConnectionStep.WALLET_CONNECT_PROVIDERS)
            }
            dataAttribute="walletType-mobile"
          />
        )}
        {isWalletVisibleForSignTyped(ProviderType.WEB3, signTypedRequired) && (
          <Item
            image={images.browserWallets}
            title={t(translations.dialogs.providerTypes.items.browser)}
            onClick={() => props.onStep(WalletConnectionStep.BROWSER_PROVIDERS)}
            dataAttribute="walletType-browser"
          />
        )}
        {props.enableSoftwareWallet && (
          <Item
            image={images.softwareWallets}
            title={t(translations.dialogs.providerTypes.items.software)}
            onClick={() =>
              props.onStep(WalletConnectionStep.SOFTWARE_PROVIDERS)
            }
          />
        )}
      </ItemList>
      {!props.hideInstructionLink && (
        <BottomLinkContainer>
          <a
            href='https://wiki.sovryn.app'
            target='_blank'
            rel='noreferrer noopener'
            data-action-id="walletDialog-link-how-to-connect"
          >
            {t(translations.dialogs.providerTypes.instructions)}
          </a>
        </BottomLinkContainer>
      )}
    </div>
  );
}

import * as React from 'react';
import { ProviderType } from '@sovryn/wallet';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { WalletContext } from '../../..';
import { isWalletVisibleForSignTyped } from '../../../helpers';
import style from './index.module.css';

interface Props {
  onWalletSelected: (value: ProviderType) => void;
  hideInstructionLink?: boolean;
}

export function HardwareWalletSelector(props: Props) {
  const { t } = useTranslation();
  const { signTypedRequired, options } = React.useContext(WalletContext);
  return (
    <div>
      <h1>{t(translations.dialogs.hardwareWallet.title)}:</h1>
      <ItemList>
        {isWalletVisibleForSignTyped(
          ProviderType.LEDGER,
          signTypedRequired,
        ) && (
          <Item
            options={options}
            image={images.ledgerWallet}
            title='Ledger'
            onClick={() => props.onWalletSelected(ProviderType.LEDGER)}
            linkHref='https://shop.ledger.com/?r=3035eca29af2'
            linkTitle='Buy Now'
            dataAttribute='hardwareWallet-ledger'
          />
        )}
        {isWalletVisibleForSignTyped(
          ProviderType.TREZOR,
          signTypedRequired,
        ) && (
          <div className={style.item}>
            <Item
              options={options}
              image={images.trezorWallet}
              title='Trezor'
              disabled
              onClick={() => props.onWalletSelected(ProviderType.TREZOR)}
              dataAttribute='hardwareWallet-trezor'
            />
            <p className={style.title}>{t(translations.discontinued)}</p>
            <p className={style.subtitle}>{t(translations.trezorDescription)}</p>
            <a
              className={style.link}
              href='https://wiki.sovryn.com/en/getting-started/trezor-deprecation'
              target='_blank'
              rel='noreferrer nofollow'
            >
              {t(translations.dialogs.walletConnect.learn)}
            </a>
          </div>
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

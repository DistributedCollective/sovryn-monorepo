import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ItemList } from '../../ItemList';
import { Item } from '../../Item';
import { images } from '../../../assets/images';
import { ProviderDialogStep } from '../../../containers/ProviderDialog/types';
import { BottomLinkContainer } from '../../BottomLinkContainer';
import { translations } from '../../../locales/i18n';

interface Props {
  onStep: (value: ProviderDialogStep) => void;
}

export function ProviderTypeSelector(props: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t(translations.dialogs.providerTypes.title)}</h1>
      <ItemList>
        <Item
          image={images.hardwareWallets}
          title={t(translations.dialogs.providerTypes.items.hardware)}
          onClick={() => props.onStep(ProviderDialogStep.HARDWARE_PROVIDERS)}
        />
        <Item
          image={images.mobileWallets}
          title={t(translations.dialogs.providerTypes.items.mobile)}
          onClick={() =>
            props.onStep(ProviderDialogStep.WALLET_CONNECT_PROVIDERS)
          }
        />
        <Item
          image={images.browserWallets}
          title={t(translations.dialogs.providerTypes.items.browser)}
          onClick={() => props.onStep(ProviderDialogStep.BROWSER_PROVIDERS)}
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

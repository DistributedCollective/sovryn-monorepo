import Classes from '@blueprintjs/core/lib/esm/common/classes';
import { Overlay } from '@blueprintjs/core/lib/esm/components/overlay/overlay';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../locales/i18n';
import styles from './index.module.css';

type DialogSize = 'normal' | 'large' | 'small';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClosed?: () => void;
  onClosing?: () => void;
  className?: string;
  children?: React.ReactNode;
  size?: DialogSize;
  portalTargetId?: string;
}

export function Dialog(props: Props) {
  const { t } = useTranslation();

  const portalTargetElement = useMemo(() => {
    if (props.portalTargetId) {
      return document.getElementById(props.portalTargetId) || undefined;
    }
    return undefined;
  }, [props.portalTargetId]);

  return (
    <Overlay
      {...props}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      usePortal={!!portalTargetElement}
      portalContainer={portalTargetElement}
    >
      <div className={Classes.DIALOG_CONTAINER}>
        <article
          role='modal'
          className={classNames(
            Classes.DIALOG,
            styles.dialog,
            props.size === 'normal' && styles.dialog_normal,
            props.size === 'large' && styles.dialog_large,
            props.size === 'small' && styles.dialog_small,
            props.className,
          )}
        >
          <button
            className={styles.close}
            onClick={props.onClose}
            type='button'
            title={t(translations.common.close)}
          >
            <span className={styles.sr_only}>
              {t(translations.common.close)}
            </span>
          </button>
          <div className={styles.content}>{props.children}</div>
        </article>
      </div>
    </Overlay>
  );
}

Dialog.defaultProps = {
  size: 'normal',
};

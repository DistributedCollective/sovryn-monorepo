import * as React from 'react';
import { Overlay, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClosed?: () => void;
  onClosing?: () => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Dialog(props: Props) {
  return (
    <Overlay
      {...props}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
    >
      <div className={Classes.DIALOG_CONTAINER}>
        <div
          className={classNames(Classes.DIALOG, props.className)}
          style={props.style}
        >
          {props.children}
        </div>
      </div>
    </Overlay>
  );
}

Dialog.defaultProps = {
  style: { padding: 20 },
};

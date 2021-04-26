import * as React from 'react';
import cn from 'classnames';
import style from './index.module.css';
import { isMobile } from '../../services/helpers';

interface Props {
  image: string;
  title: string;
  onClick?: () => void;
  active?: boolean;
  faded?: boolean;
  disabled?: boolean;
  linkTitle?: string;
  linkHref?: string;
  small?: boolean;
  href?: string;
}

export function Item(props: Props) {
  return (
    <div
      className={cn(style.container, {
        [style.container_big]: props.linkHref && props.linkTitle,
        [style.small]: props.small,
      })}
    >
      <button
        type='button'
        className={cn(style.button, {
          [style.button_active]: props.active,
          [style.button_faded]: props.faded,
        })}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <div
          className={style.image}
          style={{ backgroundImage: `url(${props.image})` }}
        />
        <div className={style.title}>{props.title}</div>
      </button>
      {props.linkHref && props.linkTitle && (
        <a
          href={props.linkHref}
          className={style.link}
          target='_blank'
          rel='noopener noreferrer'
        >
          {props.linkTitle}
        </a>
      )}
    </div>
  );
}

export function ItemLink(props: Props) {
  return (
    <div
      className={cn(style.container, {
        [style.container_big]: props.linkHref && props.linkTitle,
        [style.small]: props.small,
      })}
    >
      <a
        className={cn(style.button, {
          [style.button_active]: props.active,
          [style.button_faded]: props.faded,
        })}
        href={props.href}
        target='_blank'
        rel='noopener noreferrer'
        onClick={props.onClick}
      >
        <div
          className={style.image}
          style={{ backgroundImage: `url(${props.image})` }}
        />
        <div className={style.title}>{props.title}</div>
      </a>
      {props.linkHref && props.linkTitle && (
        <a
          href={props.linkHref}
          className={style.link}
          target='_blank'
          rel='noopener noreferrer'
        >
          {props.linkTitle}
        </a>
      )}
    </div>
  );
}

interface WalletItemProps extends Props {
  ios?: string;
  android?: string;
  universal?: string;
}

export function WalletItem(props: WalletItemProps) {
  const walletItemHref = () => {
    if (isMobile.iOS()) return props.ios || props.universal;
    if (isMobile.Android()) return props.android || props.universal;
    return props.universal;
  };

  return (
    <div>
      <ItemLink
        image={props.image}
        title={props.title}
        small={props.small}
        href={walletItemHref()}
      />
    </div>
  );
}

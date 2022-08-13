import * as React from 'react';
import cn from 'classnames';
import style from './index.module.css';
import { isMobile } from '../../services/helpers';
import { WalletOptions } from '../../contexts';

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
  dataAttribute?: string;
  options?: WalletOptions;
}

export function Item(props: Props) {
  return (
    <div
      className={cn('wallet-item', style.container, {
        [style.container_big]: props.linkHref && props.linkTitle,
        [style.small]: props.small,
        [style.sm]: props.options?.size === 'sm',
      })}
      data-action-id={props.dataAttribute}
    >
      <button
        type='button'
        className={cn(style.button, {
          [style.button_active]: props.active,
          [style.button_faded]: props.faded,
          [style.gray]: props.options?.viewType === 'gray',
        })}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <div
          className={cn('wallet-image', style.image)}
          style={{ backgroundImage: `url(${props.image})` }}
        />
        {!props.options?.hideTitle && (
          <div className={cn('wallet-title', style.title)}>{props.title}</div>
        )}
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
      className={cn('wallet-item', style.container, {
        [style.container_big]: props.linkHref && props.linkTitle,
        [style.small]: props.small,
        [style.sm]: props.options?.size === 'sm',
      })}
      data-action-id={props.dataAttribute}
    >
      <a
        className={cn(style.button, {
          [style.button_active]: props.active,
          [style.button_faded]: props.faded,
          [style.gray]: props.options?.viewType === 'gray',
        })}
        href={props.href}
        target='_blank'
        rel='noopener noreferrer'
        onClick={props.onClick}
      >
        <div
          className={cn('wallet-image', style.image)}
          style={{ backgroundImage: `url(${props.image})` }}
        />
        {!props.options?.hideTitle && (
          <div className={cn('wallet-title', style.title)}>{props.title}</div>
        )}
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
  dataAttribute?: string;
}

export function WalletItem(props: WalletItemProps) {
  const walletItemHref = () => {
    if (isMobile.iOS()) return props.ios || props.universal;
    if (isMobile.Android()) return props.android || props.universal;
    return props.universal;
  };

  return (
    <ItemLink
      options={props.options}
      image={props.image}
      title={props.title}
      small={props.small}
      href={walletItemHref()}
      dataAttribute={props.dataAttribute}
    />
  );
}

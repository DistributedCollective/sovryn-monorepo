import * as React from 'react';
import cn from 'classnames';
import style from './index.module.css';

interface Props {
  image: string;
  title: string;
  onClick: () => void;
  active?: boolean;
  faded?: boolean;
  disabled?: boolean;
  linkTitle?: string;
  linkHref?: string;
  small?: boolean;
}

export function Item(props: Props) {
  return (
    <div
      className={cn(style.container, {
        [style.container_big]: props.linkHref && props.linkTitle,
        [style.small]: props.small
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

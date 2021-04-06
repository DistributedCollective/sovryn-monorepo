import * as React from 'react';
import cn from 'classnames';
import style from './index.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ItemList(props: Props) {
  return (
    <div className={cn(style.list, props.className)}>{props.children}</div>
  );
}

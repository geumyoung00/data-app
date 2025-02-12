'use client';
// clasName by style
// Starting style : ** button className='btn'
// 1. type : nomal(no-name, default) / icon-only (only icon, hide label) / icon-with (labe with icon)
//   1-2. icon : cross / Remove / Add
// 2. state : primary (blue, no-name, default) / secondary (grey) / tertiary (red) / disabled
// 3. size : noaml(no-name, default) / min
// example - icon type, delete, icon , min : className='icon hyphen tertiary min'
// example2 - default type, edit, default size : className='secondary cross'

import '@/src/scss/_button.scss';
import Cross from '@/public/btnIcon/cross.svg';
import Remove from '@/public/btnIcon/remove.svg';
import Add from '@/public/btnIcon/add.svg';

export default function Button({
  label,
  state,
  size,
  type,
  icon,
  style,
  onClick,
}: {
  label: string;
  state?: string;
  size?: string;
  type?: string;
  icon?: string;
  style?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) {
  return (
    <>
      <button
        disabled={state === 'disabled' ? true : false}
        onClick={onClick}
        className={`btn${type ? ' ' + type : ''}${size ? ' min' : ''}${
          state ? ' ' + state : ''
        }${style ? ' ' + style : ''}`}
      >
        <span>{label}</span>
        <i>
          {icon === 'cross' ? (
            <Cross />
          ) : icon === 'remove' ? (
            <Remove />
          ) : (
            <Add />
          )}
        </i>
      </button>
    </>
  );
}

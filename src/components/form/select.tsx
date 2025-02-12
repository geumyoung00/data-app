'use client';
import Arrow from '@/public/arrow.svg';

export default function Select({
  label,
  forLabel,
  size,
  hide,
  children,
  init,
  readOnly,
}: {
  label: string;
  forLabel: string;
  size?: string;
  hide?: string;
  children?: React.ReactNode;
  init?: string;
  readOnly?: boolean;
}) {
  return (
    <>
      <label htmlFor={forLabel} className={hide ? ' ' + 'hide' : ''}>
        {label}
      </label>
      <div
        className={`select${size ? ' ' + size : ''}${init ? ' ' + init : ''}${
          readOnly ? ' read-only' : ''
        }`}
      >
        {children ? children : <option>내용 없음</option>}
        <i className={`arrow`}>
          <Arrow />
        </i>
      </div>
    </>
  );
}

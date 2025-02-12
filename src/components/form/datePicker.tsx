'use client';

import Calendar from '@/public/calendar.svg';

export default function DatePicker({
  hide,
  label,
  children,
}: {
  hide?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='date-picker'>
      <i className='icon'>
        <Calendar />
      </i>
      <label htmlFor={label} className={hide ? hide : ''}></label>
      {children}
    </div>
  );
}

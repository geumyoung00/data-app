'use client';

export default function InputText({
  label,
  children,
  size,
  hide,
}: {
  label: string;
  children: React.ReactNode;
  size?: string;
  hide?: string;
}) {
  return (
    <>
      <div className={`input-text${size ? ' ' + size : ''}`}>
        {label ? (
          <label htmlFor={label} className={hide ? hide : ''}>
            {label}
          </label>
        ) : (
          ''
        )}
        {children}
      </div>
    </>
  );
}

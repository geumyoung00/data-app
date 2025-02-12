import Check from '@/public/checkbox.svg';

export default function Checkbox({
  children,
  showLabel,
  name,
  value,
  disabled,
  onChangeHandler,
  checked,
}: {
  children: React.ReactNode;
  showLabel?: boolean;
  name: string;
  value: string;
  disabled?: boolean;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}) {
  return (
    <div className={`check${showLabel ? '' : ' center'}`}>
      <input
        type='checkbox'
        name={name}
        value={value}
        id={value}
        disabled={!!disabled}
        onChange={onChangeHandler}
        checked={checked}
      />
      <label className={showLabel ? '' : 'hide'} htmlFor={value}>
        {children}
        <i className='icon'>
          <Check />
        </i>
      </label>
    </div>
  );
}

import { radioType } from '@/src/db/settings';

export default function Radio({ options }: { options: radioType[] }) {
  return (
    <>
      <div className='radio'>
        {options?.map((option) => {
          return (
            <label key={option.name + option.value}>
              <input
                type='radio'
                id={option.value}
                name={option.name}
                value={option.value}
                defaultChecked={option.checked}
                disabled={option.disabled}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}

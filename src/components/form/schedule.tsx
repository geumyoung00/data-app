'use client';
import Check from '@/public/checkbox.svg';
import { timeArr, minuteArr, weekArr } from '@/src/db/date';
import Select from './select';
import { ErrorsType } from '@/src/action/setting-schema';
import { scheduleInfoType } from '@/src/db/settings';
import { ChangeEvent, useEffect, useState } from 'react';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;

export default function ScheduleForm({
  type,
  formRefHandler,
  errors,
  editSchedule,
}: {
  type: string;
  formRefHandler: (id: string, ref: refsType) => void;
  errors?: ErrorsType;
  editSchedule?: scheduleInfoType;
}) {
  const [schedule, setSchedule] = useState<scheduleInfoType>();
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<string>('');

  useEffect(() => {
    setSchedule(editSchedule);
    const existingWeeks = Array.from(new Set(editSchedule?.weeks?.split('|')));
    setSelectedWeeks(existingWeeks);
    setSelectedHour(editSchedule?.hour as string);
    setSelectedMinutes(editSchedule?.minutes as string);
  }, []);

  const onChangeCheck = (id: string) => {
    if (selectedWeeks.includes(id)) {
      setSelectedWeeks(selectedWeeks.filter((weekId) => weekId !== id));
    } else {
      setSelectedWeeks([...selectedWeeks, id]);
    }
  };

  switch (type) {
    default:
      break;
    case '1':
      // 매주
      return (
        <>
          <div className='schedule-form'>
            <div
              className='checkbox-group'
              ref={(ref: HTMLDivElement) => formRefHandler('weeklyChecks', ref)}
            >
              {weekArr.map((item) => {
                return (
                  <div className={`check`} key={item.id}>
                    <input
                      type='checkbox'
                      name='weeks'
                      id={item.id}
                      defaultValue={item.id}
                      onChange={() => onChangeCheck(item.id)}
                      checked={selectedWeeks.includes(item.id)}
                    />
                    <label htmlFor={item.id}>
                      <span>{item.name}</span>
                      <i className='icon'>
                        <Check />
                      </i>
                    </label>
                  </div>
                );
              })}
            </div>
            <Select label='hour' forLabel='hour' hide='hide'>
              <select
                name='hour'
                id='hour'
                ref={(ref: HTMLSelectElement) => formRefHandler('hour', ref)}
                value={selectedHour}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedHour(e.target.value)
                }
              >
                <option value='' hidden></option>
                {timeArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='minutes' forLabel='minutes' hide='hide'>
              <select
                name='minutes'
                id='minutes'
                ref={(ref: HTMLSelectElement) => formRefHandler('minutes', ref)}
                value={selectedMinutes}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMinutes(e.target.value)
                }
              >
                <option value='' hidden></option>
                {minuteArr.map((num) => {
                  return (
                    <option defaultValue={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>분</p>
          </div>
        </>
      );

    case '2':
      return (
        <>
          <div className='schedule-form'>
            <Select label='hour' forLabel='hour' hide='hide'>
              <select
                name='hour'
                id='hour'
                ref={(ref: HTMLSelectElement) => formRefHandler('hour', ref)}
                value={selectedHour}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedHour(e.target.value)
                }
              >
                <option value='' hidden></option>
                {timeArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>시</p>
            <Select label='minutes' forLabel='minutes' hide='hide'>
              <select
                name='minutes'
                id='minutes'
                ref={(ref: HTMLSelectElement) => formRefHandler('minutes', ref)}
                value={selectedMinutes}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMinutes(e.target.value)
                }
              >
                <option value='' hidden></option>
                {minuteArr.map((num) => {
                  return (
                    <option value={num} key={num}>
                      {num}
                    </option>
                  );
                })}
              </select>
            </Select>
            <p className='text'>분</p>
          </div>
        </>
      );
  }
}

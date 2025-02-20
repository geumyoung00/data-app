'use client';

import { SelectChange } from '@/src/action/form/select-change';
import { useContext, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { scheduleType, useOption } from '@/src/db/date';
import { settingFormHandler } from '@/src/action/setting-form-action';
import Button from '@/src/components/button';
import ScheduleForm from '@/src/components/form/schedule';
import Select from '@/src/components/form/select';
import Link from 'next/link';
import InputText from '@/src/components/form/inputText';
import CollectTypeForm from '@/src/components/form/collectType';
import Radio from '@/src/components/form/radio';
import { mngContext } from '@/src/store/mag-context';
import { usePathname } from 'next/navigation';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;
interface refsInterface {
  id: string;
  ref: refsType;
}

export default function CreateSettingsForm() {
  const [selectSchedule, setSelectSchedule] = useState<string>('');
  const [selectType, setSelectType] = useState<string>('');

  const [formState, createFormAction] = useFormState(settingFormHandler.bind(null, { type: 'create' }), {
    errors: {},
  });

  const pathname = usePathname();

  const errors = formState?.errors;
  let formRefs = useRef<refsInterface[]>([]);
  const mngCtx = useContext(mngContext);
  const { agencies, collectItems } = mngCtx;

  useEffect(() => {
    const fetchMngData = async () => {
      try {
        await mngCtx.fetchItems('agencies');
        await mngCtx.fetchItems('getDataType');
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    };

    fetchMngData();
  }, [pathname]);

  useEffect(() => {
    let errorsKey: string[] = [];
    for (let key in formState?.errors) errorsKey.push(key);
    if (errorsKey.length < 1) formRefs.current[0].ref.focus();
  }, [formState]);

  const formRefHandler = (id: string, ref: refsType) => {
    let idx = formRefs.current.length;
    let refkeys: string[] = [];
    formRefs.current.forEach((el) => refkeys.push(el.id));
    if (ref && idx < 1) {
      formRefs.current[0] = { id, ref };
      return;
    } else if (ref && idx >= 1) {
      const item = { id, ref };
      formRefs.current.forEach((el) => {
        if (el === item) return;
        else formRefs.current[idx] = item;
      });
    }
    return;
  };

  const initSelectHandler = (id: string, e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    const findIdx = formRefs.current.findIndex((el) => el.id === id);
    const { value } = e.target as HTMLSelectElement;
    SelectChange(formRefs.current[findIdx]!.ref, value);
  };

  return (
    <div className='form-area'>
      <form action={createFormAction}>
        <dl>
          <dt>기관</dt>
          <dd>
            <Select label='agency' forLabel='agency' hide='hide' init='init'>
              <select
                id={'agency'}
                name={'agency'}
                ref={(ref: HTMLSelectElement) => {
                  formRefHandler('agency', ref);
                }}
                onClick={(e) => initSelectHandler('agency', e)}
              >
                <option value='' hidden>
                  기관 선택
                </option>
                {agencies?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
            <Link href={'/cms/manage/agencies'} className='btn secondary' scroll={false}>
              <span>등록 기관 관리</span>
            </Link>
            {errors?.agency ? <p className='valid-script'>{errors.agency?.join()}</p> : ''}
          </dd>
        </dl>
        <dl>
          <dt>수집 항목</dt>
          <dd>
            <Select label='collectItem' forLabel='collectItem' init='init' hide='hide'>
              <select
                name='collectItem'
                id='collectItem'
                ref={(ref: HTMLSelectElement) => {
                  formRefHandler('collectItem', ref);
                }}
                onClick={(e) => initSelectHandler('collectItem', e)}
              >
                <option value='' hidden>
                  수집 항목 선택
                </option>
                {collectItems?.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
            <Link href={`/cms/manage/collectItems`} className='btn secondary' scroll={false}>
              <span>수집 항목 관리</span>
            </Link>
            {errors?.collectItem ? <p className='valid-script'>{errors.collectItem?.join(' ')}</p> : ''}
          </dd>
        </dl>
        <dl>
          <dt>수집 스케줄</dt>
          <dd>
            <Select label='collectSchedule' forLabel='collectSchedule' hide='hide' init='init'>
              <select
                name='collectSchedule'
                id='collectSchedule'
                ref={(ref: HTMLSelectElement) => {
                  formRefHandler('collectSchedule', ref);
                }}
                onClick={(e) => initSelectHandler('collectSchedule', e)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectSchedule(e.target.value);
                }}
              >
                <option value='' hidden>
                  수집 스케줄 선택
                </option>
                {scheduleType.map((item) => {
                  return (
                    <option key={item.id} value={item.seq}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
            {selectSchedule ? <ScheduleForm type={selectSchedule} formRefHandler={formRefHandler} /> : ''}
            {errors?.scheduleType ? (
              <p className='valid-script'>{errors.scheduleType}</p>
            ) : errors?.schedule && errors.schedule.length >= 3 ? (
              <p className='valid-script'>{errors.schedule[0]}</p>
            ) : errors?.schedule && errors.schedule.length < 3 ? (
              <p className='valid-script'>{errors?.schedule?.join(' ')}</p>
            ) : (
              ''
            )}
          </dd>
        </dl>
        <dl>
          <dt>수집 폴더</dt>
          <dd>
            <InputText label='root' hide='hide' size='wide'>
              <input type='text' id='root' name='root' />
            </InputText>
            {errors?.root ? <p className='valid-script'>{errors.root?.join(' ')}</p> : ''}
          </dd>
        </dl>
        <dl>
          <dt>수집 형태</dt>
          <dd>
            <Select label='collectType' forLabel='collectType' hide='hide' init='init'>
              <select
                name='collectType'
                id='collectType'
                ref={(ref: HTMLSelectElement) => {
                  formRefHandler('collectType', ref);
                }}
                onClick={(e) => initSelectHandler('collectType', e)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectType(e.target.value);
                }}
              >
                <option value='' hidden>
                  수집 형태 선택
                </option>
                <option value='API'>API</option>
              </select>
            </Select>
            {selectType ? (
              <CollectTypeForm type={selectType} error={errors!} />
            ) : errors?.collectType ? (
              <p className='valid-script'>{errors.collectType}</p>
            ) : (
              ''
            )}
          </dd>
        </dl>
        <dl>
          <dt>사용 여부</dt>
          <dd>
            <Radio options={useOption} />
            {errors?.isUsed ? <p className='valid-script'>{errors?.isUsed}</p> : null}
          </dd>
        </dl>

        <div className='apply-btn'>
          <Link href={'/cms'} className='btn secondary'>
            <span>목록</span>
          </Link>
          <Button label='등록' />
        </div>
      </form>
    </div>
  );
}

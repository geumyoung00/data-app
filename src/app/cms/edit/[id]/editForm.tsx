'use client';

import { settingFormHandler } from '@/src/action/setting-form-action';
import Button from '@/src/components/button';
import CollectTypeForm from '@/src/components/form/collectType';
import InputText from '@/src/components/form/inputText';
import Radio from '@/src/components/form/radio';
import ScheduleForm from '@/src/components/form/schedule';
import Select from '@/src/components/form/select';
import { scheduleType, unuseOption, useOption } from '@/src/db/date';
import {
  fetchSettings,
  radioType,
  scheduleInfoType,
  settingType,
} from '@/src/db/settings';
import { mngType } from '@/src/store/mag-context';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

type refsType = HTMLSelectElement | HTMLInputElement | HTMLDivElement;
interface refsInterface {
  id: string;
  ref: refsType;
}

export default function EditSettingForm() {
  const [nowSetting, setNowSetting] = useState<settingType>();
  const [selectAgency, setSelectAgency] = useState<mngType>();
  const [selectItem, setSelectItem] = useState<mngType>();
  const [selectSchedule, setSelectSchedule] = useState<scheduleInfoType>();
  const [selectScheduleType, setSelectScheduleType] = useState<string>('');
  const [selectType, setSelectType] = useState<string>('');
  const [selectTypeInfo, setSelectTypeInfo] = useState<string>('');
  const [isUsed, setIsUsed] = useState<radioType[]>();
  const router = useRouter();
  const { id } = useParams();

  const [formState, editFormAction] = useFormState(
    settingFormHandler.bind(null, { type: 'edit', id: id as string }),
    {
      errors: {},
    }
  );

  let formRefs = useRef<refsInterface[]>([]);
  const errors = formState?.errors;

  useEffect(() => {
    fetchSettings().then((res) => {
      const filterItem = res.filter((item: settingType) => item.id === id);
      const option = filterItem[0].isUsed ? useOption : unuseOption;

      setNowSetting(filterItem[0]);
      setSelectAgency(JSON.parse(filterItem[0].agency));
      setSelectItem(JSON.parse(filterItem[0].collectItem));
      setSelectScheduleType(filterItem[0].scheduleType);
      setSelectSchedule(JSON.parse(filterItem[0].schedule));
      setSelectType(filterItem[0].collectType);
      setSelectTypeInfo(filterItem[0].collectTypeInfo);
      setIsUsed(option);
      return;
    });
  }, [id]);

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

  if (
    errors?._form &&
    confirm(
      `${errors._form} 수정을 계속 하시려면 취소를 눌러주세요.\n확인을 누르시면 목록으로 돌아갑니다.`
    )
  ) {
    router.push('/cms');
  }

  const findSchedule = scheduleType.find(
    (item, idx) => idx + 1 === parseInt(selectScheduleType!)
  );

  return (
    <div className='form-area'>
      <form action={editFormAction}>
        <dl>
          <dt>기관</dt>
          <dd>
            <Select label='agency' forLabel='agency' hide='hide' readOnly>
              <select id={'agency'} name={'agency'}>
                <option value={selectAgency?.name}>{selectAgency?.name}</option>
              </select>
            </Select>
            <Link
              href={'/cms/manage/agencies'}
              className='btn secondary'
              scroll={false}
            >
              <span>등록 기관 관리</span>
            </Link>
          </dd>
        </dl>
        <dl>
          <dt>수집 항목</dt>
          <dd>
            <Select
              label='collectItem'
              forLabel='collectItem'
              hide='hide'
              readOnly
            >
              <select name='collectItem' id='collectItem'>
                <option value={selectItem?.name}>{selectItem?.name}</option>
              </select>
            </Select>
            <Link
              href={`/cms/manage/collectItems`}
              className='btn secondary'
              scroll={false}
            >
              <span>수집 항목 관리</span>
            </Link>
          </dd>
        </dl>
        <dl>
          <dt>수집 스케줄</dt>
          <dd>
            <Select
              label='collectSchedule'
              forLabel='collectSchedule'
              hide='hide'
            >
              <select
                name='collectSchedule'
                id='collectSchedule'
                value={selectScheduleType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectScheduleType(e.target.value)
                }
              >
                {scheduleType.map((item) => {
                  return (
                    <option key={item.id} value={item.seq}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
            {selectScheduleType ? (
              <ScheduleForm
                type={findSchedule?.seq as string}
                formRefHandler={formRefHandler}
                editSchedule={selectSchedule}
                errors={errors}
              />
            ) : (
              ''
            )}
          </dd>
        </dl>
        <dl>
          <dt>수집 폴더</dt>
          <dd>
            <InputText label='root' hide='hide' size='wide'>
              <input
                type='text'
                id='root'
                name='root'
                defaultValue={nowSetting?.root}
              />
            </InputText>
          </dd>
        </dl>
        <dl>
          <dt>수집 형태</dt>
          <dd>
            <Select label='collectType' forLabel='collectType' hide='hide'>
              <select
                name='collectType'
                id='collectType'
                ref={(ref: HTMLSelectElement) => {
                  formRefHandler('collectType', ref);
                }}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectType(e.target.value);
                }}
              >
                <option value={nowSetting?.collectType}>
                  {nowSetting?.collectType.toUpperCase()}
                </option>
              </select>
            </Select>
            {selectType ? (
              <CollectTypeForm
                type={selectType}
                error={errors!}
                collectTypeInfo={selectTypeInfo}
              />
            ) : (
              ''
            )}
          </dd>
        </dl>
        <dl>
          <dt>사용 여부</dt>
          <dd>
            <Radio options={isUsed!} />
          </dd>
        </dl>
        <div className='apply-btn'>
          <Link href={'/cms'} className='btn secondary'>
            <span>취소</span>
          </Link>
          <Button label='저장' />
        </div>
      </form>
    </div>
  );
}

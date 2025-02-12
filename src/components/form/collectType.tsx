'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '../button';
import InputText from './inputText';
import { ErrorsType } from '@/src/action/setting-schema';
import { collectTypeInfoType, scheduleInfoType } from '@/src/db/settings';
import DatePicker from './datePicker';

type apiParamsType = {
  key: string;
  value: string;
};

type AddErrorType = { key: string; value: string };

export default function CollectTypeForm({
  type,
  error,
  collectTypeInfo,
}: {
  type: string;
  error: ErrorsType;
  collectTypeInfo?: string;
}) {
  const [apiPrmts, setApiPrmts] = useState<apiParamsType[]>();
  const [selectTypeInfo, setSelectTypeInfo] = useState<collectTypeInfoType>();
  const [addError, setAddError] = useState<AddErrorType>({
    key: '',
    value: '',
  });
  const addApiRefs = useRef<HTMLInputElement[]>([]);
  switch (type) {
    case 'API':
      useEffect(() => {
        if (collectTypeInfo) {
          const parseTypeInfo: collectTypeInfoType =
            JSON.parse(collectTypeInfo);
          setSelectTypeInfo(parseTypeInfo);
          setApiPrmts(parseTypeInfo.apiPrmt);
        }
      }, []);

      const addPrmtHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const key = addApiRefs.current[0].value;
        const value = addApiRefs.current[1].value;
        const findSameKey = apiPrmts?.filter((el) => el.key === key).join();
        const findSameValue = apiPrmts
          ?.filter((el) => el.value === value)
          .join();

        if (!key) {
          return setAddError({ ...addError, key: 'key를 입력하세요.' });
        } else if (!value) {
          return setAddError({ key: '', value: 'value를 입력하세요.' });
        }

        if (findSameKey) {
          return setAddError({
            ...addError,
            key: '동일한 key를 가진 파라미터가 있습니다.',
          });
        } else if (findSameValue) {
          return setAddError({
            key: '',
            value: '동일한 value를 가진 파라미터가 있습니다.',
          });
        }

        if (!apiPrmts) {
          setApiPrmts([{ key, value }]);
        } else {
          setApiPrmts([...apiPrmts, { key, value }]);
        }

        setAddError({ key: '', value: '' });
        addApiRefs.current[0].value = '';
        addApiRefs.current[1].value = '';
      };

      const removeParamsHandler = (e: React.FormEvent, idx: number) => {
        e.preventDefault();
        const filterIdx = apiPrmts?.filter((obj, i) => i !== idx);
        setApiPrmts(filterIdx);
      };

      return (
        <>
          <div className='inner-form block'>
            <dl>
              <dt>KEY</dt>
              <dd>
                <InputText label='apiKey' hide='hide' size='wide'>
                  <input
                    type='text'
                    id='apiKey'
                    name='apiKey'
                    autoFocus={!collectTypeInfo ? true : false}
                    defaultValue={selectTypeInfo?.apiKey}
                  />
                </InputText>
              </dd>
            </dl>
            <dl>
              <dt>URL</dt>
              <dd>
                <InputText label='apiUrl' hide='hide' size='wide'>
                  <input
                    type='text'
                    id='apiUrl'
                    name='apiUrl'
                    defaultValue={selectTypeInfo?.apiUrl}
                  />
                </InputText>
              </dd>
            </dl>
            <dl>
              <dt>유효기간</dt>
              <dd>
                <DatePicker hide='hide' label='apiStartDate'>
                  <input
                    type='date'
                    name='apiStartDate'
                    id='apiStartDate'
                    defaultValue={selectTypeInfo?.apiStartDate}
                  />
                </DatePicker>
                <p className='text'>~</p>
                <DatePicker hide='hide' label='apiEndDate'>
                  <input
                    type='date'
                    name='apiEndDate'
                    id='apiEndDate'
                    defaultValue={selectTypeInfo?.apiEndDate}
                  />
                </DatePicker>
              </dd>
            </dl>
            <dl>
              <dt>파라미터</dt>
              <dd>
                <ul className='parameters'>
                  <li className='add-params'>
                    <InputText label='newApiParamsKey' hide='hide' size='min'>
                      <input
                        type='text'
                        id='newApiParamsKey'
                        name='newApiParamsKey'
                        ref={(el) => {
                          addApiRefs.current[0] = el as HTMLInputElement;
                        }}
                      />
                    </InputText>
                    <InputText label='newApiParamsValue' hide='hide' size='min'>
                      <input
                        type='text'
                        id='newApiParamsValue'
                        name='newApiParamsValue'
                        ref={(el) => {
                          addApiRefs.current[1] = el as HTMLInputElement;
                        }}
                      />
                    </InputText>
                    <Button
                      size='min'
                      label='추가'
                      icon='add'
                      type='icon-only'
                      onClick={(e) => addPrmtHandler(e)}
                    />
                  </li>
                  {apiPrmts?.map((el, idx) => {
                    return (
                      <li key={el.key}>
                        <InputText
                          label={idx + 'apiParamsKey'}
                          hide='hide'
                          size='min'
                        >
                          <input
                            type='text'
                            id={idx + 'apiParamsKey'}
                            name='apiParamsKey'
                            defaultValue={el.key}
                            readOnly
                          />
                        </InputText>
                        <InputText
                          label={idx + 'apiParamsValue'}
                          hide='hide'
                          size='min'
                        >
                          <input
                            type='text'
                            id={idx + 'apiParamsValue'}
                            name='apiParamsValue'
                            defaultValue={el.value}
                            readOnly
                          />
                        </InputText>
                        <Button
                          size='min'
                          label='삭제'
                          icon='remove'
                          type='icon-only'
                          state='tertiary'
                          onClick={(e) => removeParamsHandler(e, idx)}
                        />
                      </li>
                    );
                  })}
                </ul>
                {addError.key || addError.value ? (
                  <p className='valid-script'>
                    {addError.key || addError.value}
                  </p>
                ) : (
                  ''
                )}
              </dd>
            </dl>
          </div>
          {error.collectTypeInfo ? (
            <p className='valid-script'>{error.collectTypeInfo[0]}</p>
          ) : (
            ''
          )}
        </>
      );
  }
}

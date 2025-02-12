'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Button from '../button';
import Checkbox from '../form/checkbox';
import InputText from '../form/inputText';
import { usePathname, useRouter } from 'next/navigation';
import { mngContext, mngType } from '@/src/store/mag-context';

export default function MngTable() {
  const [mngData, setMngData] = useState<mngType[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const pathname = usePathname();
  const checkPath = pathname.includes('agencies')
    ? '기관'
    : pathname.includes('collectItems')
    ? '수집 항목'
    : '';

  const editIdRefs = useRef<HTMLInputElement[]>([]);
  const editNameRefs = useRef<HTMLInputElement[]>([]);
  const addRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  const mngCtx = useContext(mngContext);
  const { agencies, collectItems } = mngCtx;

  const typePath = pathname.includes('agencies')
    ? 'agencies'
    : pathname.includes('collectItems')
    ? 'getDataType'
    : '';

  const fetchMngData = async () => {
    await mngCtx.fetchItems(typePath);
  };

  useEffect(() => {
    fetchMngData();
  }, []);

  useEffect(() => {
    if (typePath === 'agencies') {
      const newAgencies = agencies.map((agency) => ({
        ...agency,
        isEdit: false,
      }));
      setMngData(newAgencies);
    } else if (typePath === 'getDataType') {
      const newCollectItems = collectItems.map((item) => ({
        ...item,
        isEdit: false,
      }));
      setMngData(newCollectItems);
    }
  }, [mngCtx, typePath]);

  const checkedHandler = (checked: boolean, seq: string) => {
    if (checked) {
      return setCheckedList((prev) => [...prev, seq]);
    } else {
      return setCheckedList(checkedList.filter((el) => el !== seq));
    }
  };

  const allCheckedHandler = (checked: boolean) => {
    if (checked) {
      const allSeqs = mngData.map((el) => el.seq as string);
      return setCheckedList(allSeqs);
    } else {
      return setCheckedList([]);
    }
  };

  const updateHandler = async (
    type: string,
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
    seq?: string
  ) => {
    e!.preventDefault();
    const nowIdx = mngData.findLastIndex((el) => el.seq === seq);
    const selectNameInput = editNameRefs.current[nowIdx];
    const selectIdInput = editIdRefs.current[nowIdx];
    const selectNameText = selectNameInput?.value;
    const selectData = { ...mngData[nowIdx], isEdit: true };
    let changeArr = [...mngData];

    switch (type) {
      case 'add':
        const addIdInput = addRefs.current[0];
        const addNameInput = addRefs.current[1];
        const addNameValue = addNameInput.value;
        const addIdValue = addIdInput.value;
        const notKor = /^[a-zA-z0-9]+$/;

        const compareName = mngData.filter(
          (el) =>
            el.name.toLocaleLowerCase() ===
              addNameInput.value.toLocaleLowerCase() ||
            el.name.trim().split(' ').join('') ===
              addNameInput.value.trim().split(' ').join('')
        );

        const compareId = mngData.filter(
          (el) =>
            el.id.toLocaleLowerCase() ===
              addIdInput.value.toLocaleLowerCase() ||
            el.id.trim().split(' ').join('') ===
              addIdInput.value.trim().split(' ').join('')
        );

        if (!addIdInput.value || compareId.length > 0) {
          !addIdInput.value
            ? alert(checkPath + ' 아이디를 입력하세요.')
            : alert('동일한 아이디가 있습니다.');
          addIdInput.focus();
          return;
        }

        if (!addNameInput.value || compareName.length > 0) {
          !addNameInput.value
            ? alert(checkPath + ' 이름을 입력하세요.')
            : alert('동일한 이름이 있습니다.');
          addNameInput.focus();
          return;
        }

        if (!notKor.test(addIdValue)) {
          alert('영문 대소문자와 숫자만 입력할 수 있습니다.');
          addIdInput.value = '';
          addIdInput.focus();
          return;
        }

        mngCtx.addItem(typePath, { id: addIdValue, name: addNameValue });

        addNameInput.value = '';
        addIdInput.value = '';

        break;

      case 'delete':
        const selectItems = mngData.filter(({ seq }) =>
          checkedList.includes(seq as string)
        );

        if (checkedList.length < 1) return alert('선택된 항목이 없습니다.');

        if (checkedList.length === mngData.length) {
          if (confirm(`전체 항목을 삭제하시나요?`)) {
            mngCtx.removeItem(typePath, checkedList);
            setCheckedList([]);
            return;
          } else return;
        }

        if (checkedList.length >= 1) {
          let filterName: string[] = [];
          selectItems.forEach((el) => (filterName = [...filterName, el.name]));

          if (
            confirm(`선택된 항목을 확인해주세요.\n\n ${filterName.join(
              '\n '
            )}\n\n위 항목을 삭제할까요?
            `)
          ) {
            mngCtx.removeItem(typePath, checkedList);
            setCheckedList([]);
            return;
          } else return;
        }

        break;

      case 'edit':
        selectNameInput.removeAttribute('readOnly');
        selectNameInput.focus();
        selectNameInput.value = '';
        selectNameInput.value = selectNameText;

        changeArr[nowIdx] = selectData;

        setMngData(changeArr);

        break;

      case 'save':
        const prevName = mngData[nowIdx].name
          .trim()
          .split(' ')
          .join('')
          .toUpperCase();

        const nowName = selectNameText;

        if (prevName === nowName) {
          if (
            confirm(
              `수정된 내용이 없습니다.\n확인을 누르시면 수정창이 닫힙니다.`
            )
          ) {
            selectNameInput.setAttribute('readOnly', 'true');
            changeArr[nowIdx] = { ...changeArr[nowIdx], isEdit: false };
            setMngData(changeArr);
            return;
          } else return selectNameInput.focus();
        }

        if (prevName !== nowName.trim().split(' ').join('').toUpperCase()) {
          const changedData = { ...selectData, name: nowName, isEdit: false };
          changeArr[nowIdx] = changedData;
          mngCtx.updateItem(typePath, changedData);
        }

        selectNameInput.setAttribute('readOnly', 'true');
        selectIdInput.setAttribute('readOnly', 'true');
        setMngData(changeArr);
        break;
    }
  };

  return (
    <div className='table'>
      <table>
        <colgroup>
          <col width='6%' />
          <col width='43%' />
          <col width='43%' />
          <col width='8%' />
        </colgroup>
        <thead>
          <tr>
            <th>
              <Checkbox
                name='all'
                value='all'
                onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                  allCheckedHandler(e.target.checked)
                }
                checked={
                  checkedList.length > 0 &&
                  mngData.length === checkedList.length
                }
              >
                <span>전체 선택</span>
              </Checkbox>
            </th>
            <th>{checkPath} 아이디</th>
            <th>{checkPath} 이름</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Checkbox name='sample' value='sample' disabled>
                <span>선택</span>
              </Checkbox>
            </td>
            <td>
              <InputText
                label={`신규 등록 ${checkPath} 입력`}
                size='min'
                hide='hide'
              >
                <input
                  type='text'
                  name='newAgencyName'
                  id={`신규 등록 ${checkPath} 입력`}
                  ref={(el: HTMLInputElement) => {
                    addRefs.current[0] = el;
                  }}
                />
              </InputText>
            </td>
            <td>
              <InputText
                label={`신규 등록 ${checkPath} 아이디 입력`}
                size='min'
                hide='hide'
              >
                <input
                  type='text'
                  name='newAgencyId'
                  autoFocus
                  id={`신규 등록 ${checkPath} 아이디 입력`}
                  ref={(el: HTMLInputElement) => {
                    addRefs.current[1] = el;
                  }}
                />
              </InputText>
            </td>
            <td>
              <Button
                label='등록'
                style='line'
                size='min'
                onClick={(e) => updateHandler('add', e)}
              />
            </td>
          </tr>
          {mngData.length < 1 ? (
            <tr>
              <td colSpan={4}>등록된 데이터가 없습니다.</td>
            </tr>
          ) : (
            <>
              {mngData.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      <Checkbox
                        name={item.name}
                        value={JSON.stringify(item.id)}
                        onChangeHandler={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          checkedHandler(e.target.checked, item.seq as string)
                        }
                        checked={checkedList.includes(item.seq as string)}
                      >
                        <span>{item.name}</span>
                      </Checkbox>
                    </td>
                    <td>
                      <InputText label={item.name} size='min' hide='hide'>
                        <input
                          type='text'
                          name={item.id + 'Id'}
                          id={item.name}
                          readOnly
                          defaultValue={item.id}
                          ref={(el) => {
                            (editIdRefs.current![
                              idx
                            ] as unknown as HTMLInputElement | null) = el;
                          }}
                        />
                      </InputText>
                    </td>
                    <td>
                      <InputText label={item.name} size='min' hide='hide'>
                        <input
                          type='text'
                          name={item.id + 'Name'}
                          readOnly
                          defaultValue={item.name}
                          ref={(el) => {
                            (editNameRefs.current![
                              idx
                            ] as unknown as HTMLInputElement | null) = el;
                          }}
                        />
                      </InputText>
                    </td>
                    <td>
                      {item.isEdit ? (
                        <Button
                          label='저장'
                          style='line'
                          size='min'
                          onClick={(e) => updateHandler('save', e, item.seq)}
                        />
                      ) : (
                        <Button
                          label='수정'
                          style='line'
                          size='min'
                          state='secondary'
                          onClick={(e) => updateHandler('edit', e, item.seq)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
      <div className='btn-group in-modal'>
        <Button
          label='삭제'
          state='tertiary'
          onClick={(e) => updateHandler('delete', e)}
        />
        <Button label='이전' state='secondary' onClick={() => router.back()} />
      </div>
    </div>
  );
}
